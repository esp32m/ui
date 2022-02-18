import { once } from 'lodash-es';
import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';
import { Name, IProps } from './types';

export const useBme280 = once((props?: IProps) => {
  useDevices();
  registerPlugin({ name: Name, device: { component: Content, props } });
});
