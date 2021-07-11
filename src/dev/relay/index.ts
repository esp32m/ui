import { once } from 'lodash';
import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import Content from './Content';

export const useRelay = once(
  (nameOrList: string | Array<[string, string]>, title?: string) => {
    useDevices();
    Plugins.register({
      name: 'relay-' + name,
      device: { component: Content, props: { nameOrList, title } },
    });
  }
);
