import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';

export const usePressureSensor = (
  name: string,
  title = 'Pressure sensor'
): void => {
  useDevices();
  registerPlugin({
    name,
    device: { component: Content, props: { name, title } },
  });
};
