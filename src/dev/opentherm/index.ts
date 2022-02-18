import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Master from './Master';
import Slave from './Slave';

export const useOpenthermMaster = (name: string, title?: string): void => {
  useDevices();
  registerPlugin({
    name,
    device: { component: Master, props: { name, title } },
  });
};

export const useOpenthermSlave = (name: string, title?: string): void => {
  useDevices();
  registerPlugin({
    name,
    device: { component: Slave, props: { name, title } },
  });
};
