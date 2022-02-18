import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import { Name } from './types';
import Content from './Content';

export const useSht3x = (name: string = Name, title?: string): void => {
  useDevices();
  registerPlugin({
    name,
    device: { component: Content, props: { name, title } },
  });
};
