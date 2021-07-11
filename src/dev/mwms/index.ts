import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import Content from './Content';

export const useMicrowaveMotionSensor = (
  name: string,
  title = 'Microwave motion sensor'
): void => {
  useDevices();
  Plugins.register({
    name,
    device: { component: Content, props: { name, title } },
  });
};
