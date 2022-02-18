import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import { Name } from './types';
import Content from './Content';

export const useMax6675 = (name: string = Name, title?: string): void => {
  useDevices();
  registerPlugin({
    name,
    device: { component: Content, props: { name, title } },
  });
};
