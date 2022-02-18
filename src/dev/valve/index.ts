import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';

export const useValve = (name: string, title?: string): void => {
  useDevices();
  registerPlugin({
    name,
    device: { component: Content, props: { name, title } },
  });
};
