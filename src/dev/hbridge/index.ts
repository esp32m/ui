import { once } from 'lodash';
import { useDevices } from '../shared';
import { Plugins } from '../../plugins';
import Content from './Content';

export const useHbridge = once(
  (nameOrList: string | Array<[string, string]>, title?: string) => {
    useDevices();
    Plugins.register({
      name: 'hbridge-' + name,
      device: { component: Content, props: { nameOrList, title } },
    });
  }
);
