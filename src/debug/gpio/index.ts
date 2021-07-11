import { once } from 'lodash';

import { Plugins } from '../../plugins';
import { useDebug } from '../shared';
import content from './Content';
import { Name } from './types';

export const useGpio = once(() => {
  useDebug();
  Plugins.register({ name: Name, debug: { content } });
});
