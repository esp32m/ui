import { Plugins } from '../plugins';
import { Memory } from '@material-ui/icons';
export { default as SystemHealth } from './Health';
import Content from './Content';
import { once } from 'lodash';

export const useSystem = once(() => {
  Plugins.register({
    name: 'system',
    content: { title: 'System', icon: Memory, component: Content },
  });
});
