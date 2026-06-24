import type { DotMatrix } from '../../types/heritage';
import {
  DotPadSDK,
  DotPadScanner,
  DisplayMode,
  DataCodes,
  type DotDevice,
} from './sdk/DotPadSDK-3_0_0.js';
import { dotMatrixToHex, countRaisedDots, EXPECTED_HEX_LENGTH } from './dotMatrixToHex';

export type DotPadStatus =
  | 'unsupported'
  | 'disconnected'
  | 'searching'
  | 'connecting'
  | 'connected';

export interface DotPadState {
  status: DotPadStatus;
  deviceName: string;
  lastError: string;
  lastSentDots: number;
  /** True once a real device has connected at least once this session. */
  wasConnected: boolean;
}

type StateListener = (state: DotPadState) => void;

/**
 * Real-device adapter around the official Dot Pad SDK 3.0.0 (Web Bluetooth).
 *
 * Mirrors the proven flow used in the Dot Forest game:
 *   scanner.startBleScan() → sdk.connectBleDevice() → sdk.displayGraphicData(hex)
 *
 * SDK 3.0 may hand back a usable device before the `Connected` callback fires,
 * so connect() treats the returned handle as connected and schedules a few
 * resends to cover the brief window where the graphic plane is still waking up.
 */
export class HardwareDotPadAdapter {
  private sdk = new DotPadSDK();
  private scanner = new DotPadScanner();
  private device: DotDevice | null = null;
  private lastMatrix: DotMatrix | null = null;
  private resendTimers: number[] = [];
  private connectionTimeout: number | null = null;
  private static readonly CONNECT_TIMEOUT_MS = 30_000;

  private state: DotPadState = {
    status: hasWebBluetooth() ? 'disconnected' : 'unsupported',
    deviceName: '',
    lastError: '',
    lastSentDots: 0,
    wasConnected: false,
  };

  private listeners = new Set<StateListener>();

  constructor() {
    this.sdk.setCallBack(
      (device, code, data) => this.handleMessage(device, code, data),
      () => {},
    );
  }

  get supported(): boolean {
    return this.state.status !== 'unsupported';
  }

  getState(): DotPadState {
    return { ...this.state };
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private setState(patch: Partial<DotPadState>): void {
    this.state = { ...this.state, ...patch };
    const snapshot = this.getState();
    this.listeners.forEach((l) => l(snapshot));
  }

  /** Must be called from a user gesture (Web Bluetooth requirement). */
  async connect(): Promise<void> {
    if (!this.supported) {
      this.setState({
        lastError:
          'Web Bluetooth를 지원하지 않는 환경입니다. 데스크톱 Chrome/Edge(HTTPS)에서 시도하세요.',
      });
      return;
    }
    if (this.device) return;

    try {
      this.clearConnectionTimeout();
      this.setState({ status: 'searching', lastError: '' });

      // Arm a 30-second watchdog so the UI never hangs in "searching" indefinitely.
      this.connectionTimeout = window.setTimeout(() => {
        if (this.state.status === 'searching' || this.state.status === 'connecting') {
          this.device = null;
          this.setState({
            status: 'disconnected',
            lastError: '연결 시간 초과 (30초). 다시 시도하세요.',
          });
        }
        this.connectionTimeout = null;
      }, HardwareDotPadAdapter.CONNECT_TIMEOUT_MS);

      const selected = await this.scanner.startBleScan();
      if (!selected) {
        this.clearConnectionTimeout();
        this.setState({ status: 'disconnected', lastError: '연결할 Dot Pad를 선택하지 않았습니다.' });
        return;
      }

      this.setState({ status: 'connecting' });
      const dev = await this.sdk.connectBleDevice(selected);
      if (!dev) {
        this.clearConnectionTimeout();
        this.setState({ status: 'disconnected', lastError: 'Dot Pad 연결에 실패했습니다.' });
        return;
      }

      this.clearConnectionTimeout();
      // Treat the returned handle as connected even before the SDK callback.
      this.device = dev;
      this.setState({ status: 'connected', wasConnected: true });
      if (this.lastMatrix) {
        this.sendMatrix(this.lastMatrix);
        this.scheduleResends();
      }
    } catch (error) {
      this.clearConnectionTimeout();
      this.device = null;
      this.setState({ status: 'disconnected', lastError: errorMessage(error) });
      console.error('[DotPad] connect failed:', error);
    }
  }

  async disconnect(): Promise<void> {
    this.clearConnectionTimeout();
    this.clearResends();
    const dev = this.device;
    this.device = null;
    this.setState({ status: 'disconnected', deviceName: '' });
    if (dev) {
      try {
        await this.sdk.disconnect(dev);
      } catch (error) {
        console.warn('[DotPad] disconnect warning:', error);
      }
    }
  }

  /** Encode + push a frame. Remembers the last matrix for auto-resend on connect. */
  sendMatrix(matrix: DotMatrix): { ok: boolean; message: string } {
    this.lastMatrix = matrix;
    try {
      const hex = dotMatrixToHex(matrix);
      if (hex.length !== EXPECTED_HEX_LENGTH) {
        throw new Error(`Expected ${EXPECTED_HEX_LENGTH} hex chars, got ${hex.length}.`);
      }
      const dots = countRaisedDots(matrix);

      if (!this.device) {
        return { ok: false, message: 'Dot Pad가 연결되어 있지 않습니다.' };
      }

      this.sdk.displayGraphicData(hex, this.device, DisplayMode.GraphicMode);
      this.setState({ lastSentDots: dots, lastError: '' });
      return { ok: true, message: `프레임 전송 완료 · ${dots} dots` };
    } catch (error) {
      this.setState({ lastError: errorMessage(error) });
      console.error('[DotPad] send failed:', error);
      return { ok: false, message: `전송 실패: ${errorMessage(error)}` };
    }
  }

  /** Clear the display by sending an empty frame. */
  clear(): void {
    const empty: DotMatrix = {
      width: 60,
      height: 40,
      cells: Array.from({ length: 40 }, () => Array(60).fill(0)) as DotMatrix['cells'],
    };
    this.sendMatrix(empty);
  }

  private scheduleResends(): void {
    this.clearResends();
    // Graphic plane may activate a moment after connect — resend over a few seconds.
    [500, 1200, 2500, 4500].forEach((delay) => {
      const id = window.setTimeout(() => {
        if (this.device && this.lastMatrix) this.sendMatrix(this.lastMatrix);
      }, delay);
      this.resendTimers.push(id);
    });
  }

  private clearResends(): void {
    this.resendTimers.forEach((id) => window.clearTimeout(id));
    this.resendTimers = [];
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeout !== null) {
      window.clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  private handleMessage(device: DotDevice, code: string, data?: string): void {
    if (code === DataCodes.DeviceName) {
      this.setState({ deviceName: data || '' });
      return;
    }
    if (code === DataCodes.Connected) {
      this.clearConnectionTimeout();
      this.device = device;
      this.setState({ status: 'connected', wasConnected: true });
      // Board info ready — resend the current frame to be safe.
      if (this.lastMatrix) this.sendMatrix(this.lastMatrix);
      return;
    }
    if (code === DataCodes.Disconnected) {
      this.clearResends();
      this.device = null;
      this.setState({ status: 'disconnected', deviceName: '' });
      return;
    }
    if (code === DataCodes.ConnectedFail || code === DataCodes.CommandError) {
      this.setState({ lastError: data || code });
      return;
    }
    if (code === DataCodes.ResponseDisplayLineNonAck) {
      this.setState({ lastError: data || 'Dot Pad가 표시 명령을 수신 확인하지 못했습니다.' });
    }
  }
}

function hasWebBluetooth(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

function errorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  if (error instanceof Error) return error.message;
  return String(error);
}

/** App-wide singleton so Home and Guide share one connection. */
let singleton: HardwareDotPadAdapter | null = null;
export function getDotPadAdapter(): HardwareDotPadAdapter {
  if (!singleton) singleton = new HardwareDotPadAdapter();
  return singleton;
}
