import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';

export const useMoistureSensor = (
  name: string,
  title = 'Moisture sensor'
): void => {
  useDevices();
  registerPlugin({
    name,
    device: { component: Content, props: { name, title } },
  });
};
