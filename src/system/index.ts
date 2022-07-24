import { registerPlugin } from '../plugins';
import { Memory } from '@mui/icons-material';
export { default as SystemHealth } from './Health';
import Content from './Content';
import { once } from 'lodash';

export const useSystem = once(() => {
  registerPlugin({
    name: 'system',
    content: { title: 'System', icon: Memory, component: Content },
  });
});
