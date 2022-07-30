import { Memory } from '@mui/icons-material';
import { IContentPlugin } from '../app/types';
export { default as SystemHealth } from './Health';
import Content from './Content';

export const System: IContentPlugin = {
  name: 'system',
  content: { title: 'System', icon: Memory, component: Content },
};
