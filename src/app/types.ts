import React from 'react';

export type RouteCreator = (p: Record<string, unknown>) => JSX.Element;
export type RouteCreators = Array<RouteCreator>;

export interface IAppModel {
  root?: () => React.ComponentType;
  routes?: RouteCreators;
}

export interface IAppState {
  name: string;
}

export interface IMenuItem {
  name: string;
  title?: string;
  icon?: React.ComponentType;
}

export interface IContent {
  title?: string;
  icon?: React.ComponentType;
  component: () => React.ComponentType;
}

export interface IMenu {
  name?: string;
  items: Array<IMenuItem>;
}

export interface IStateFetcherContext {
  add: (name: string) => void;
  remove: (name: string) => void;
  use: (name: string) => () => void;
}

export const StateFetcherContext = React.createContext<
  IStateFetcherContext | undefined
>(undefined);
