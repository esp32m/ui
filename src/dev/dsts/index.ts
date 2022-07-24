import { once } from 'lodash';
import { registerPlugin } from '../../plugins';
import { useDevices } from '../shared';
import Content from './Content';
import { Name, IProps } from './types';

export const useDsts = once((props?: IProps) => {
  useDevices();
  registerPlugin({ name: Name, device: { component: Content, props } });
});
