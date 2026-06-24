import { useEffect, useState, useCallback } from 'react';
import { getDotPadAdapter, type DotPadState } from './HardwareDotPadAdapter';
import type { DotMatrix } from '../../types/heritage';

/**
 * React binding for the shared Dot Pad hardware adapter.
 * Returns live connection state plus connect / disconnect / send helpers.
 */
export function useDotPad() {
  const adapter = getDotPadAdapter();
  const [state, setState] = useState<DotPadState>(() => adapter.getState());

  useEffect(() => adapter.subscribe(setState), [adapter]);

  const connect = useCallback(() => adapter.connect(), [adapter]);
  const disconnect = useCallback(() => adapter.disconnect(), [adapter]);
  const sendMatrix = useCallback((m: DotMatrix) => adapter.sendMatrix(m), [adapter]);
  const clear = useCallback(() => adapter.clear(), [adapter]);

  const toggle = useCallback(() => {
    if (state.status === 'connected') adapter.disconnect();
    else if (state.status === 'disconnected' || state.status === 'unsupported') adapter.connect();
  }, [adapter, state.status]);

  return {
    ...state,
    isConnected: state.status === 'connected',
    isBusy: state.status === 'searching' || state.status === 'connecting',
    supported: adapter.supported,
    connect,
    disconnect,
    toggle,
    sendMatrix,
    clear,
  };
}
