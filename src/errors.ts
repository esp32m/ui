import { IPlugin, usePlugins, registerPlugin } from '.';

export const enum ErrType {}

export interface IEspError {
  code: number;
  name?: string;
  text?: string;
}

type EspErrorMapEntry = string | [string, string];
interface IEspErrorMap {
  [key: number]: EspErrorMapEntry;
}

interface IEspErrorsPlugin extends IPlugin {
  errors: IEspErrorMap;
}

const errors: IEspErrorMap = {
  0x101: 'NO_MEM',
  0x102: 'INVALID_ARG',
  0x103: 'INVALID_STATE',
  0x104: 'INVALID_SIZE',
  0x105: 'NOT_FOUND',
  0x106: 'NOT_SUPPORTED',
  0x107: 'TIMEOUT',
  0x108: 'INVALID_RESPONSE',
  0x109: 'INVALID_CRC',
  0x10a: 'INVALID_VERSION',
  0x10b: 'INVALID_MAC',
  0x201: 'NOT_FINISHED',
};

function codeToError(code: number): IEspError {
  switch (code) {
    case -1:
      return { code, name: 'ESP_FAIL' };
    case 0:
      return { code, name: 'ESP_OK' };
    default: {
      let e: EspErrorMapEntry | undefined;
      for (const p of usePlugins<IEspErrorsPlugin>((p) => !!p.errors)) {
        const f = p.errors[code];
        if (f) {
          e = f;
          break;
        }
      }
      switch (typeof e) {
        case 'string':
          return { code, name: 'ESP_ERR_' + e };
        case 'object':
          return { code, name: 'ESP_ERR_' + e[0], text: e[1] };
        default:
          return { code };
      }
    }
  }
}

export const describeError = (a: unknown): IEspError | undefined => {
  switch (typeof a) {
    case 'number':
      return codeToError(a);
    case 'object':
      if (a) return describeError((a as { error: unknown }).error);
      break;
  }
};

export const formatError = (a: unknown): string | undefined => {
  const e = describeError(a);
  if (e) {
    let s: string = e.name || '0x' + e.code.toString(16);
    if (e.text) s += ' ' + e.text;
    return s;
  }
};

registerPlugin({ name: 'esp_err', errors });
