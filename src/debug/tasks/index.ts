import { once } from 'lodash-es';

import { registerPlugin } from '../../plugins';
import { useDebug } from '../shared';
import content from './Content';
import { Name } from './types';

export const useTasks = once((props?: unknown) => {
  useDebug();
  registerPlugin({ name: Name, debug: { content, props } });
});
