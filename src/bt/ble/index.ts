import { AnyAction } from 'redux';
import once from 'lodash/once';

import { fromBase64, Plugins } from '../..';
import { useBt } from '../shared';

import Content from './Content';
import {
  ILocalState,
  AdvType,
  IAdv,
  AdvField,
  AdvDataFlags,
  IAdvData,
  Name,
} from './types';

function parseData(buf: ArrayBuffer): IAdvData | undefined {
  const bytes = new Uint8Array(buf);
  const byteLength = bytes.byteLength;
  let ofs = 0;
  const r: IAdvData = {};
  while (ofs < byteLength) {
    const len = bytes[ofs++] - 1; // length without type octet
    const type = bytes[ofs++] as AdvField;
    switch (type) {
      case AdvField.Flags:
        if (len != 1) return;
        r.flags = bytes[ofs] as AdvDataFlags;
        break;
      case AdvField.CompName:
      case AdvField.IncompName:
        {
          let n = '';
          for (let i = 0; i < len; i++)
            n += String.fromCharCode(bytes[ofs + i]);
          r.name = n;
        }
        break;
    }
    ofs += len;
  }
  return r;
}

function toAdv(e: Array<unknown>): IAdv {
  const result: IAdv = {
    type: e[0] as AdvType,
    rssi: e[1] as number,
    addr: e[2] as string,
  };
  if (e[3]) result.directAddr = e[3] as string;
  if (e[4]) result.data = parseData(fromBase64(e[4] as string));
  return result;
}

const reducer = (state: ILocalState = {}, { type, payload }: AnyAction) => {
  if (type == 'backend/response' && payload.source == Name && payload.data)
    switch (payload.name) {
      case 'scan': {
        const advs = payload.data.map(toAdv);
        const peripherals = Object.assign({}, state?.peripherals);
        for (const a of advs) {
          const e = peripherals[a.addr];
          if (!e || a.data) peripherals[a.addr] = a;
        }
        return { ...state, peripherals };
      }
    }
  return state;
};

export const useBle = once(() => {
  useBt();
  Plugins.register({ name: Name, reducer, bt: { content: Content } });
});
