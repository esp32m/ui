import React, { ComponentType, ReactElement } from 'react';
import { Reducer } from 'redux';
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
  icon?: ComponentType;
  component?: ComponentType;
  menu?: {
    section?: string;
    parent?: string;
    index?: number;
  };
}
export interface IContentPlugin extends IPlugin {
  content: IContent;
}

export interface IRouterPlugin extends IPlugin {
  routes: RouteCreators;
}
export interface IReduxPlugin extends IPlugin {
  reducer: Reducer | Record<string, Reducer>;
}
