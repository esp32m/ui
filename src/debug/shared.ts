import { BugReport } from '@mui/icons-material';
import { once } from 'lodash';

import { registerPlugin } from '../plugins';

import Content from './Content';

export const useDebug = once(() => {
  registerPlugin({
    name: 'debug',
    content: { title: 'Debug', icon: BugReport, component: Content },
  });
});
