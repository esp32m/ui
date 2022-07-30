export const Name = 'mqtt';

export interface IMqttConfig {
  enabled: boolean;
  uri: string;
  client: string;
  username: string;
  password: string;
}

export interface IMqttState {
  ready: boolean;
  uri: string;
  client: string;
  pubcnt: number;
  cmdcnt: number;
}
