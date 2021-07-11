import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import Content from './Content';

export const usePressureSensor = (
  name: string,
  title = 'Pressure sensor'
): void => {
  useDevices();
  Plugins.register({
    name,
    device: { component: Content, props: { name, title } },
  });
};
