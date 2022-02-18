import React, { useMemo } from 'react';

import { IAppState } from '../app/types';
import { IContentPlugin } from './types';
import { useModuleState, usePlugins } from '..';
import { NavListProps, Dashboard } from '../components';
import { useAppModel } from '.';

function DashboardLayout({ children }: React.PropsWithChildren<unknown>) {
  const name = useModuleState<IAppState>('app', { once: true })?.name;
  const plugins = usePlugins();
  const section = useMemo(() => {
    const items: Array<NavListProps> = [];
    plugins.forEach((p) => {
      const cp = p as IContentPlugin;
      if (cp.content) {
        const { title, icon } = cp.content;
        if (title || icon) {
          const item: NavListProps = {
            path: '/' + p.name,
            title: title || p.name,
            icon: icon && React.createElement(icon),
          };
          if (p.name === 'home') items.splice(0, 0, item);
          else items.push(item);
        }
      }
    });
    return { name: 'main', items };
  }, [plugins]);
  const { title, logo } = useAppModel() || {};
  const menu = { sections: [section], title, logo };
  const dp = {
    name,
    menu,
    children,
  };
  return <Dashboard {...dp} />;
}

export default DashboardLayout;
