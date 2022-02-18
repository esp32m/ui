import { once } from 'lodash-es';
import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';

export const useEm = once((name:string, title?: string) => {
  useDevices();
  registerPlugin({ name, device: { component: Content, props:{name, title} } });
});
