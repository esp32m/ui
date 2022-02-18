import { Scanner } from '@mui/icons-material';
import { once } from 'lodash-es';

import { registerPlugin } from '../plugins';

import Scanners from './Scanners';

export const useScanners = once(() => {
  registerPlugin({
    name: 'bus-scanners',
    content: { title: 'Bus scanners', icon: Scanner, component: Scanners },
  });
});
