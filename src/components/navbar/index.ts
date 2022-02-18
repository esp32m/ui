import { matchPath } from 'react-router-dom';
import { registerPlugin } from '../..';
import { IThemePlugin } from '../theme/types';

// ----------------------------------------------------------------------

export { default as NavbarVertical } from './vertical/Navbar';
export {
  useCollapseDrawer,
  CollapseDrawerProvider,
} from './vertical/CollapseDrawerContext';
export { default as NavbarHorizontal } from './horizontal/Navbar';
export * from './types';

export function isExternalLink(path: string) {
  return path.startsWith('http');
}

export function getActive(path: string, pathname: string) {
  return path ? !!matchPath({ path: path, end: false }, pathname) : false;
}

const DefaultConfig = {
  header: {
    MOBILE_HEIGHT: 64,
    MAIN_DESKTOP_HEIGHT: 88,
    DASHBOARD_DESKTOP_HEIGHT: 92,
    DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
  },
  navbar: {
    BASE_WIDTH: 260,
    DASHBOARD_WIDTH: 280,
    DASHBOARD_COLLAPSE_WIDTH: 88,
    DASHBOARD_ITEM_ROOT_HEIGHT: 48,
    DASHBOARD_ITEM_SUB_HEIGHT: 40,
    DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
  },
  icon: {
    NAVBAR_ITEM: 22,
    NAVBAR_ITEM_HORIZONTAL: 20,
  },
};
export type IStaticConfig = typeof DefaultConfig;

declare module '@mui/material/styles' {
  interface Theme {
    config: typeof DefaultConfig;
  }
}

registerPlugin<IThemePlugin>({
  name: 'navbar',
  theme: { config: DefaultConfig },
});
