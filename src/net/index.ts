export * from './mqtt';
export * from './sntp';
export * from './shared';

import Content from './Content';
import { IContentPlugin } from '../app/types';
import { Network } from './shared';

export const NetworkInterfaces: IContentPlugin = {
  name: 'netifs',
  use: Network,
  content: {
    title: 'Interfaces',
    component: Content,
    menu: { parent: Network.name },
  },
};
