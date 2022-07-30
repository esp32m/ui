import { AccessTime as icon } from '@mui/icons-material';
import { IContentPlugin } from '../../app/types';
import { Network } from '../shared';
import Content from './Content';
import { Name } from './types';

export const Sntp: IContentPlugin = {
  name: Name,
  use: Network,
  content: {
    title: 'SNTP time sync',
    icon,
    component: Content,
    menu: { parent: Network.name },
  },
};
