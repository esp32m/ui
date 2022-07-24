import { once } from 'lodash';
import { useDevices } from '../shared';
import { registerPlugin } from '../../plugins';
import Content from './Content';

export const useHbridge = once(
  (nameOrList: string | Array<[string, string]>, title?: string) => {
    useDevices();
    registerPlugin({
      name: 'hbridge-' + name,
      device: { component: Content, props: { nameOrList, title } },
    });
  }
);
