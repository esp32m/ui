import { once } from 'lodash-es';
import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';
import { NameOrList } from './types';

export const useRelay = once((nameOrList: NameOrList, title?: string) => {
  useDevices();
  registerPlugin({
    name: 'relay',
    device: { component: Content, props: { nameOrList, title } },
  });
});
