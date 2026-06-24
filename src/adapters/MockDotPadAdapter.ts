import type {
  DotPadAdapter,
  DotPadConnectionStatus,
  PanningKeyEvent,
} from './DotPadAdapter';
import type { TactilePattern } from '../types/tactileSync';

/**
 * Demo-mode adapter. Lets the full sync flow run with no physical device:
 * it tracks status, "accepts" patterns/text (logging + remembering the last
 * frame), and relays panning-key events. The on-screen Dot Pad Preview is the
 * visible output in this mode.
 */
export class MockDotPadAdapter implements DotPadAdapter {
  private status: DotPadConnectionStatus = 'demo';
  private keyListeners = new Set<(e: PanningKeyEvent) => void>();
  lastPattern: TactilePattern | null = null;
  lastBraille = '';

  async connect(): Promise<void> {
    this.status = 'demo';
    console.info('[MockDotPad] demo mode active — no physical device');
  }

  async disconnect(): Promise<void> {
    this.status = 'disconnected';
  }

  async sendTactilePattern(pattern: TactilePattern): Promise<void> {
    this.lastPattern = pattern;
    console.debug(`[MockDotPad] pattern → ${pattern.patternId}`);
  }

  async sendBrailleText(text: string): Promise<void> {
    this.lastBraille = text;
  }

  onPanningKey(callback: (event: PanningKeyEvent) => void): () => void {
    this.keyListeners.add(callback);
    return () => this.keyListeners.delete(callback);
  }

  /** Test/keyboard helper: fan a key out to listeners. */
  emitKey(event: PanningKeyEvent): void {
    this.keyListeners.forEach((cb) => cb(event));
  }

  getConnectionStatus(): DotPadConnectionStatus {
    return this.status;
  }
}
