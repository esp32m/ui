export interface IProps {
  name: string;
  title?: string;
}

export const enum RelayState {
  Unknow = 'unknown',
  On = 'on',
  Off = 'off',
}

export interface IState {
  state: RelayState;
}

export interface IMultiProps {
  nameOrList: string | Array<[string, string]>;
  title?: string;
}
