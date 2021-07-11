import { once } from 'lodash';
import { Reducer } from 'redux';
import { Plugins } from '../..';
import { Name } from './types';
import { useScanners } from '../shared';
import Scanner from './Scanner';

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

export const useOwbScanner = once(() => {
  useScanners();
  Plugins.register({ name: Name, reducer, scanner: { component: Scanner } });
});
