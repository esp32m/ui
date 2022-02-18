import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';

export const useIna = (name:string, title?:string): void => {
  useDevices();
  registerPlugin({ name, device: { component: Content, props:{name, title} } });
};

