import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import { Name } from './types';
import Content from './Content';

export const useBuzzer = (name: string = Name, title?: string): void => {
  useDevices();
  Plugins.register({
    name,
    device: { component: Content, props: { name, title } },
  });
};
