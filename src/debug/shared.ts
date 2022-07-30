import { BugReport } from '@mui/icons-material';
import { IContentPlugin } from '../app/types';

import Content from './Content';

export const Debug: IContentPlugin = {
  name: 'debug',
  content: { title: 'Debug', icon: BugReport, component: Content },
};
