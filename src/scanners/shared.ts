import { Scanner } from '@mui/icons-material';
import { IContentPlugin } from '../app/types';
import component from './Scanners';

export const Scanners: IContentPlugin = {
  name: 'bus-scanners',
  content: { title: 'Bus scanners', icon: Scanner, component },
};
