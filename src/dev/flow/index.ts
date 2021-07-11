import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import Content from './Content';

export const useFlowSensor = (name: string, title = 'Flow sensor'): void => {
  useDevices();
  Plugins.register({
    name,
    device: { component: Content, props: { name, title } },
  });
};
