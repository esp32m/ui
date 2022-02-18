import React, { ReactElement } from 'react';
import { IPlugin } from '..';

export type RouteCreator = (p: Record<string, unknown>) => JSX.Element;
export type RouteCreators = Array<RouteCreator>;

export interface IAppModel {
  logo?: ReactElement;
  title?: string;
  root?: () => React.ComponentType;
  routes?: RouteCreators;
}

export interface IAppState {
  name: string;
}

export interface IContent {
  title?: string;
  icon?: React.ComponentType;
  component: () => React.ComponentType;
}

export interface IContentPlugin extends IPlugin {
  content: IContent;
}


