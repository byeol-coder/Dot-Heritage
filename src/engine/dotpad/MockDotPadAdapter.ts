import type { DotPadAdapter, DotMatrix } from '../../types/heritage';

export class MockDotPadAdapter implements DotPadAdapter {
  private connected = false;
  private onMatrixSent?: (m: DotMatrix) => void;

  constructor(callback?: (m: DotMatrix) => void) {
    this.onMatrixSent = callback;
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log('[MockDotPad] connected');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log('[MockDotPad] disconnected');
  }

  async sendMatrix(matrix: DotMatrix): Promise<void> {
    if (!this.connected) throw new Error('Not connected');
    this.onMatrixSent?.(matrix);
  }

  async clear(): Promise<void> {
    const empty = { width: 60 as const, height: 40 as const, cells: Array.from({ length: 40 }, () => Array(60).fill(0)) };
    this.onMatrixSent?.(empty as DotMatrix);
  }
}
