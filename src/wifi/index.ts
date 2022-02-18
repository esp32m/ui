import { AnyAction } from 'redux';
import { registerPlugin } from '../plugins';
import { Wifi } from '@mui/icons-material';
import { Name } from './types';

import Page from './Content';
import { once } from 'lodash-es';

export { default as ScanList } from './ScanList';
export { default as ScannerBox } from './ScannerBox';
export { default as StaInfoBox } from './StaInfoBox';
export { default as ApInfoBox } from './ApInfoBox';
export * from './CaptivePortal';

const reducer = (state = {}, { type, payload }: AnyAction) => {
  if (type == 'backend/response' && payload.source == Name)
    switch (payload.name) {
      case 'scan':
        return { ...state, scan: payload.data };
    }
  return state;
};

export const useWifi = once(() => {
  registerPlugin({
    name: Name,
    reducer,
    content: { title: 'WiFi', icon: Wifi, component: Page },
  });
});
