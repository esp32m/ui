import { DevicesOther } from '@material-ui/icons';
import { once } from 'lodash';

import { Plugins } from '../plugins';

import Content from './Content';

export const useDevices = once(() => {
  Plugins.register({
    name: 'devices',
    content: { title: 'Devices', icon: DevicesOther, component: Content },
  });
});
