import type { TactilePattern } from '../types/tactileSync';

export type DotPadConnectionStatus =
  | 'unsupported'
  | 'disconnected'
  | 'searching'
  | 'connecting'
  | 'connected'
  | 'demo';

/** Logical panning / function keys the Dot Pad (or keyboard) can emit. */
export type PanningKey =
  | 'front'
  | 'side'
  | 'detail'
  | 'prevHotspot'
  | 'nextHotspot'
  | 'reread'
  | 'resend'
  | 'prevHeritage'
  | 'nextHeritage';

export interface PanningKeyEvent {
  key: PanningKey;
  source: 'keyboard' | 'device';
}

/**
 * Output abstraction for the Dot Pad. The real device path is provided by the
 * Web Bluetooth HardwareDotPadAdapter (see engine/dotpad); this interface is
 * what the sync layer consumes so a Mock can stand in when no device exists.
 */
export interface DotPadAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendTactilePattern(pattern: TactilePattern): Promise<void>;
  sendBrailleText(text: string): Promise<void>;
  onPanningKey(callback: (event: PanningKeyEvent) => void): () => void;
  getConnectionStatus(): DotPadConnectionStatus;
}
