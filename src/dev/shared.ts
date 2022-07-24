import { DevicesOther } from '@mui/icons-material';
import { once } from 'lodash';

import { registerPlugin } from '../plugins';

import Content from './Content';

export const useDevices = once(() => {
  registerPlugin({
    name: 'devices',
    content: { title: 'Devices', icon: DevicesOther, component: Content },
  });
});
