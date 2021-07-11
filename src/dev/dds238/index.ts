import { once } from 'lodash';
import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import Content from './Content';
import { Name, IProps } from './types';

export const useDds238 = once((props?: IProps) => {
  useDevices();
  Plugins.register({ name: Name, device: { component: Content, props } });
});