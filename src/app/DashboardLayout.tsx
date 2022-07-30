import React, { createElement, useMemo } from 'react';

import { IAppState } from '../app/types';
import { IContentPlugin } from './types';
import { useModuleState, usePlugins } from '..';
import { Dashboard, INavItem } from '../components';
import { useAppModel } from '.';

export const useMainMenuSections = () => {
  type Item = INavItem & { plugin: IContentPlugin };
  function toNavItem(plugin: IContentPlugin) {
    const { name, content } = plugin;
    const { title, icon } = content;
    const item: Item = {
      path: '/' + name,
      title: title || name,
      icon: icon && createElement(icon),
      plugin,
    };
    return item;
  }
  function getIndex({
    plugin: {
      name,
      content: { menu },
    },
  }: Item) {
    return menu?.index != undefined ? menu.index : name == 'home' ? -1 : 0;
  }
  function sort(items?: Array<Item>) {
    if (!items) return;
    return items.sort((a, b) => getIndex(a) - getIndex(b));
  }
  const plugins = usePlugins<IContentPlugin>();
  return useMemo(() => {
    const all = plugins.filter(
      ({ content }) => !!(content?.title || content?.icon)
    );
    const byName = all.reduce((m, c) => {
      m[c.name] = toNavItem(c);
      return m;
    }, {} as Record<string, Item>);
    const bySection: Record<string, INavItem[]> = {};
    Object.values(byName).forEach((i) => {
      const {
        plugin: { content },
      } = i;
      const { menu } = content;
      const pi = menu?.parent && byName[menu.parent];
      if (pi) {
        const children = pi.children || (pi.children = []);
        children.push(i);
      } else {
        const sn = menu?.section || '';
        (bySection[sn] || (bySection[sn] = [])).push(i);
      }
    });
    Object.values(byName).forEach((i) => sort(i.children as Item[]));
    return Object.keys(bySection).map((sn) => {
      return {
        subheader: sn ? sn : undefined,
        items: sort(bySection[sn] as Item[])||[],
      };
    });
  }, [plugins]);
};

function DashboardLayout({ children }: React.PropsWithChildren<unknown>) {
  const name = useModuleState<IAppState>('app', { once: true })?.name;
 /* const plugins = usePlugins();
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
  }, [plugins]);*/
  const sections=useMainMenuSections();
  const { title, logo } = useAppModel() || {};
  const menu = { sections, title, logo };
  const dp = {
    name,
    menu,
    children,
  };
  return <Dashboard {...dp} />;
}

export default DashboardLayout;
