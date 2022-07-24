import { once } from 'lodash';

import { registerPlugin } from '../../plugins';
import { useDebug } from '../shared';
import content from './Content';
import { Name } from './types';

export const useGpio = once(() => {
  useDebug();
  registerPlugin({ name: Name, debug: { content } });
});
