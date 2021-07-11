import { Scanner } from '@material-ui/icons';
import { once } from 'lodash';

import { Plugins } from '../plugins';

import Scanners from './Scanners';

export const useScanners = once(() => {
  Plugins.register({
    name: 'bus-scanners',
    content: { title: 'Bus scanners', icon: Scanner, component: Scanners },
  });
});
