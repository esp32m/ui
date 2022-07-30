import { Backend } from '..';

export const Name = 'wifi';

export const enum WifiMode {
  Null,
  Sta,
  Ap,
  ApSta,
  Max,
}

export const enum WifiStatus {
  None = 0,
  ApStarted = 1 << 0,
  ApHasIpv6 = 1 << 1,
  ApHasClient = 1 << 2,
  StaStarted = 1 << 3,
  StaConnected = 1 << 4,
  StaHasIp = 1 << 5,
  StaHasIpv6 = 1 << 6,
  EthStarted = 1 << 7,
  EthConnected = 1 << 8,
  EthHasIp = 1 << 9,
  EtрHasIpv6 = 1 << 10,
  Scanning = 1 << 11,
  ScanDone = 1 << 12,
  DnsIdle = 1 << 13,
  DnsDone = 1 << 14,
}

export const enum WifiPower {
  dBm_19_5 = 78, // 19.5dBm
  dBm_19 = 76, // 19dBm
  dBm_18_5 = 74, // 18.5dBm
  dBm_17 = 68, // 17dBm
  dBm_15 = 60, // 15dBm
  dBm_13 = 52, // 13dBm
  dBm_11 = 44, // 11dBm
  dBm_8_5 = 34, // 8.5dBm
  dBm_7 = 28, // 7dBm
  dBm_5 = 20, // 5dBm
  dBm_2 = 8, // 2dBm
  dBm_minus_1 = -4, // -1dBm
}

export const enum WifiAuth {
  None,
  WEP,
  WPA_PSK,
  WPA2_PSK,
  WPA_WPA2_PSK,
  WPA2_ENTERPRISE,
}

export interface IApInfo {
  ssid: string;
  mac: string;
  ip: string;
  gw: string;
  mask: string;
  cli: number;
}

export interface IStaInfo {
  ssid: string;
  bssid: string;
  mac: string;
  ip: string;
  gw: string;
  mask: string;
  rssi: number;
}

export interface IScanEntry extends Array<string | number> {
  0: string; // ssid
  1: WifiAuth;
  2: number; // rssi
  3: number; // channel
  4: string; // bssid
}

export type ScanEntries = Array<IScanEntry>;

export interface IWifiState {
  mode: WifiMode;
  ch: number;
  txp: number;
  status: WifiStatus;
  ap?: IApInfo;
  sta?: IStaInfo;
}

export interface ILocalState {
  scan: ScanEntries;
}

export interface IRootState extends Backend.IRootState {
  [Name]: ILocalState;
}

export const enum ApEntryFlags {
  None = 0,
  Fallback = 1,
}

export interface IApEntry extends Array<string | number> {
  0: number; // id
  1: string; // ssid
  2: string; // pwd - masked,
  3: ApEntryFlags; // flags
  4: number; // failcount
  5: string; // bssid
}

export type ApEntries = Array<IApEntry>;

export interface IWifiConfig {
  txp: number;
  aps?: ApEntries;
}
