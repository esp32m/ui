import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';

export const useFlowSensor = (name: string, title = 'Flow sensor'): void => {
  useDevices();
  registerPlugin({
    name,
    device: { component: Content, props: { name, title } },
  });
};
