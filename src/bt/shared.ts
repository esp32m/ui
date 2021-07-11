import { Bluetooth } from '@material-ui/icons';

import { Plugins } from '..';

import Content from './Content';
import once from 'lodash/once';

export const useBt = once(() => {
  Plugins.register({
    name: 'bt',
    content: { title: 'Bluetooth', icon: Bluetooth, component: Content },
  });
});
