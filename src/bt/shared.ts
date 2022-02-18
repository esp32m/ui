import { Bluetooth } from '@mui/icons-material';

import { registerPlugin } from '..';

import Content from './Content';
import { once } from 'lodash-es';

export const useBt = once(() => {
  registerPlugin({
    name: 'bt',
    content: { title: 'Bluetooth', icon: Bluetooth, component: Content },
  });
});
