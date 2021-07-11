import { BugReport } from '@material-ui/icons';
import { once } from 'lodash';

import { Plugins } from '../plugins';

import Content from './Content';

export const useDebug = once(() => {
  Plugins.register({
    name: 'debug',
    content: { title: 'Debug', icon: BugReport, component: Content },
  });
});
