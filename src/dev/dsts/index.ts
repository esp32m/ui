import { once } from 'lodash';
import { Plugins } from '../../plugins';
import { useDevices } from '../shared';
import Content from './Content';
import { Name, IProps } from './types';

export const useDsts = once((props?: IProps) => {
  useDevices();
  Plugins.register({ name: Name, device: { component: Content, props } });
});
