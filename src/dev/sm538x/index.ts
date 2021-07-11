import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import Content from './Content';

export const useSm538x = (name: string, title?: string): void => {
  useDevices();
  Plugins.register({
    name,
    device: { component: Content, props: { name, title } },
  });
};
