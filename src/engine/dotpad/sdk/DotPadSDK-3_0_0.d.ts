// Type declarations for the official Dot Pad SDK 3.0.0 (vendored JS module).
// Only the surface used by HardwareDotPadAdapter is declared; the rest is loose.

export const DisplayMode: {
  GraphicMode: 'GraphicMode';
  TextMode: 'TextMode';
};

export const DataCodes: Readonly<{
  Connected: 'Connected';
  ConnectedFail: 'ConnectedFail';
  Disconnected: 'Disconnected';
  BoardInfo: 'BoardInfo';
  BleMacAddress: 'BleMacAddress';
  DeviceName: 'DeviceName';
  DeviceFWVersion: 'DeviceFWVersion';
  DeviceHWVersion: 'DeviceHWVersion';
  ResponseDisplayLineAck: 'ResponseDisplayLineAck';
  ResponseDisplayLineNonAck: 'ResponseDisplayLineNonAck';
  ResponseDisplayLineComplete: 'ResponseDisplayLineComplete';
  CommandError: 'CommandError';
  [key: string]: string;
}>;

export const KeyCodes: Record<string, string>;
export const DeviceInfo: unknown;

/** A connected Dot Pad device handle returned by the SDK. */
export type DotDevice = unknown;

export type SdkMessageCallback = (device: DotDevice, code: string, data?: string) => void;
export type SdkKeyCallback = (device: DotDevice, key: string, rawCode?: string) => void;

export class DotPadScanner {
  /** Opens the browser BLE chooser; resolves to the selected device or null. */
  startBleScan(): Promise<unknown | null>;
}

export class DotPadSDK {
  setCallBack(onMessage: SdkMessageCallback, onKey?: SdkKeyCallback): void;
  /** Connects to a scanned device; resolves to a DotDevice handle. */
  connectBleDevice(selectedDevice: unknown): Promise<DotDevice | null>;
  /** Sends a 600-char uppercase-hex graphic frame to the device. */
  displayGraphicData(hex: string, device: DotDevice, mode: string): void;
  disconnect(device: DotDevice): Promise<void> | void;
}
