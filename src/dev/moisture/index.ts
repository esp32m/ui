import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import Content from './Content';

export const useMoistureSensor = (
  name: string,
  title = 'Moisture sensor'
): void => {
  useDevices();
  Plugins.register({
    name,
    device: { component: Content, props: { name, title } },
  });
};
