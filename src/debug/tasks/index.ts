import { once } from 'lodash';

import { Plugins } from '../../plugins';
import { useDebug } from '../shared';
import content from './Content';
import { Name } from './types';

export const useTasks = once((props?: unknown) => {
  useDebug();
  Plugins.register({ name: Name, debug: { content, props } });
});
