import { once } from 'lodash';
import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';
import { Name, IProps } from './types';

export const useYw801r= once((props?: IProps) => {
  useDevices();
  registerPlugin({ name: Name, device: { component: Content, props } });
});
