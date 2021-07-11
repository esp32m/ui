import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Toolbar } from '@material-ui/core';
import {
  Root,
  getHeader,
  getContent,
  getDrawerSidebar,
  getSidebarContent,
  getCollapseBtn,
  getFooter,
  getSidebarTrigger,
} from '@mui-treasury/layout';

import { IMenu, IMenuItem, IAppState } from '../app/types';
import { Menu } from '../app';
import { Plugins } from '../plugins';
import * as Backend from '../backend';
import { Typography } from '@material-ui/core';

import styled from 'styled-components';

const Header = getHeader(styled);
const Content = getContent(styled);
const Sidebar = getDrawerSidebar(styled);
const SidebarContent = getSidebarContent(styled);
const Footer = getFooter(styled);
const SidebarTrigger = getSidebarTrigger(styled);
const CollapseBtn = getCollapseBtn(styled);

import LayoutBuilder from '@mui-treasury/layout/builders';
import { IContentPlugin } from './types';

const scheme = LayoutBuilder();

scheme.configureHeader((builder) => {
  builder
    .registerConfig('xs', {
      position: 'sticky',
      initialHeight: 56,
    })
    .registerConfig('md', {
      position: 'relative',
      initialHeight: 64,
      clipped: true,
    });
});

scheme.configureEdgeSidebar((builder) => {
  builder
    .create('primarySidebar', {
      anchor: 'left',
    })
    .registerTemporaryConfig('xs', {
      width: 256,
    })
    .registerPermanentConfig('sm', {
      width: 256,
      collapsible: true,
      collapsedWidth: 65,
      headerMagnetEnabled: true,
    });
});

scheme.enableAutoCollapse('primarySidebar', 'sm');

export interface ILayoutElementProps {
  collapsed?: boolean;
}

export type LayoutElement = (props: ILayoutElementProps) => React.ComponentType;

interface IProps {
  state: IAppState;
  preset?: string;
  menu?: IMenu;
  header?: LayoutElement;
  footer?: LayoutElement;
  sidebar?: LayoutElement;
}

let MainMenu: IMenu | undefined = undefined;

function Dashboard(props: React.PropsWithChildren<IProps>) {
  useEffect(() => {
    Backend.requestState('app');
    if (!MainMenu) {
      const plugins = Plugins.all();
      const items: Array<IMenuItem> = [];
      plugins.forEach((p) => {
        const cp = p as IContentPlugin;
        if (cp.content) {
          const { title, icon } = cp.content;
          if (title || icon) {
            const item = { name: p.name, title, icon };
            if (item.name == 'home') items.splice(0, 0, item);
            else items.push(item);
          }
        }
      });
      MainMenu = { name: 'main', items };
    }
  }, []);
  const { children, state, menu = MainMenu } = props;
  const { name } = state || {};
  useEffect(() => {
    if (name) document.title = name;
  }, [name]);
  return (
    <Root scheme={scheme}>
      {({ state: { sidebar } }) => {
        const collapsed = sidebar.primarySidebar?.collapsed || false;
        const sbProps = { sidebarId: 'primarySidebar' };
        return (
          <>
            <Header>
              <Toolbar>
                <SidebarTrigger {...sbProps} />
                {props.header ? (
                  React.createElement(props.header({ collapsed }))
                ) : (
                  <Typography
                    noWrap
                    component="h1"
                    variant="h6"
                    color={'textSecondary'}
                  >
                    ESP32 manager{name && ' - [' + name + ']'}
                  </Typography>
                )}
              </Toolbar>
            </Header>
            <Sidebar {...sbProps}>
              <SidebarContent>
                {props.sidebar && props.sidebar({ collapsed })}
                {menu && <Menu menu={menu} collapsed={collapsed} />}
              </SidebarContent>
              <CollapseBtn />
            </Sidebar>
            {children && <Content> {children}</Content>}
            {props.footer && (
              <Footer>
                {React.createElement(props.footer({ collapsed }))}
              </Footer>
            )}
          </>
        );
      }}
    </Root>
  );
}

interface IRootState extends Backend.IRootState {
  app: IAppState;
}

export default connect((state: IRootState) => ({
  state: Backend.selectState<IAppState>(state, 'app'),
}))(Dashboard);
