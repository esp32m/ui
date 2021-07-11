export const Name = 'ESP32';

export interface IHeapState {
  size: number;
  free: number;
  min: number;
  max: number;
}

export const enum ChipModel {
  ESP32 = 1,
  ESP32S2 = 2,
  ESP32S3 = 4,
}

export const enum ChipFeatures {
  EmbFlash = 1 << 0,
  WifiBgn = 1 << 1,
  Ble = 1 << 4,
  Bt = 1 << 5,
}

export const enum ResetReason {
  Unknown = 1,
  PowerOn,
  Ext,
  Sw,
  Panic,
  IntWdt,
  TaskWdt,
  Wdt,
  DeepSleep,
  Brownout,
  Sdio,
}

export interface IChipState {
  model: ChipModel;
  revision: number;
  cores: number;
  features: ChipFeatures;
  freq: number;
  mac: number;
  temperature: number;
  rr: ResetReason;
}

export interface IFlashState {
  size: number;
  speed: number;
  mode: number;
}

export interface ISpiffsState {
  size: number;
  free: number;
}

export interface IPsramState {
  size: number;
  free: number;
  min: number;
  max: number;
}

export interface IHardwareState {
  heap: IHeapState;
  chip: IChipState;
  flash: IFlashState;
  spiffs: ISpiffsState;
  psram: IPsramState;
}

export interface IAppState {
  name: string;
  time: number;
  uptime: number;
  built: string;
  version: string;
  sdk: string;
  size: number;
}

export interface ISystemConfig {
  pm: [number, number, boolean];
}

export const Models = {
  [ChipModel.ESP32]: 'ESP32',
  [ChipModel.ESP32S2]: 'ESP32S2',
  [ChipModel.ESP32S3]: 'ESP32S3',
};
export const Features: { [key: number]: string } = {
  [ChipFeatures.EmbFlash]: 'EMB_FLASH',
  [ChipFeatures.WifiBgn]: 'WIFI_BGN',
  [ChipFeatures.Ble]: 'BLE',
  [ChipFeatures.Bt]: 'BT',
};
export const ResetReasons = [
  '',
  'PowerOn',
  'ExtPin',
  'Software',
  'Panic',
  'IntWdt',
  'TaskWdt',
  'OtherWdt',
  'DeepSleep',
  'BrownOut',
  'SDIO',
];
