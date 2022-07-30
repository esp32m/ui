import { DevicesOther } from '@mui/icons-material';
import { IContentPlugin } from '../app/types';

import Content from './Content';

export const Devices: IContentPlugin = {
  name: 'devices',
  content: { title: 'Devices', icon: DevicesOther, component: Content },
};
