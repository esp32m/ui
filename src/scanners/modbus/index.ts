import { Reducer } from 'redux';
import { Name } from './types';
import { Scanners } from '../shared';
import Scanner from './Scanner';
import { IScannerPlugin } from '../types';
import { IReduxPlugin } from '../../app/types';

const reducer: Reducer = (state = {}, { type, payload }) => {
  if (payload && payload.source == Name && payload.name == 'scan')
    switch (type) {
      case 'backend/response':
        return { ...state, scan: payload.data };
      case 'backend/request':
        return { ...state, scan: {} };
    }
  return state;
};

export const ModbusScanner: IScannerPlugin & IReduxPlugin = {
  name: Name,
  use: Scanners,
  reducer,
  scanner: { component: Scanner },
};
