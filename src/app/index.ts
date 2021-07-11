import React, { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import isArray from 'lodash/isArray';
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Reducer,
} from 'redux';
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import * as Backend from '../backend';
import { Plugins } from '../plugins';
import { IAppModel, RouteCreators, StateFetcherContext } from './types';
import { resolveFunction } from './utils';
import Root from './Root';

export { default as WidgetBox } from './WidgetBox';
export { default as NameValueList } from './NameValueList';
export { default as ButtonBar, IButtonProps } from './ButtonBar';
export { default as Expander } from './Expander';
export { Menu } from './Menu';
export * from './utils';
export { Form as ConfigForm, Box as ConfigBox, useConfig } from './Config';
export * from './Alert';
export * from './MessageBox';

interface IBuildInfo {
  version: string;
  built: string;
  mode: 'development' | 'production';
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
    __build_info?: IBuildInfo;
  }
}

export const buildInfo = window.__build_info;

interface IReducers {
  [key: string]: Reducer;
}

interface IUseModuleOptions {
  condition?: boolean;
}

export const useModuleState = (
  name: string,
  options?: IUseModuleOptions
): void => {
  const ctx = useContext(StateFetcherContext);
  if (ctx) {
    const deps = [];
    const { condition } = options || {};
    if (condition !== undefined) deps.push(condition);
    useEffect(() => {
      if (condition === undefined || condition) return ctx.use(name);
    }, deps);
  }
};

function init(model: IAppModel) {
  const history = createBrowserHistory();
  const reducers: IReducers = {
    router: connectRouter(history),
  };
  const routes: RouteCreators = [];
  const plugins = Plugins.all();
  plugins.forEach((p) => {
    if (p.reducer) {
      if (isArray(p.reducer))
        for (const key in p.reducer) reducers[key] = p.reducer[key];
      else reducers[p.name] = p.reducer as Reducer;
    }
    if (p.routes) routes.push(...resolveFunction(p.routes as RouteCreators));
    if (p.content)
      routes.push(() =>
        React.createElement(Route, {
          path: '/' + p.name,
          component: (p.content as { component: React.ComponentType })
            .component,
          key: p.name,
        })
      );
  });

  const rootReducer = combineReducers(reducers);
  const initialState = {};
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware,
        routerMiddleware(history),
        Backend.middleware
      )
    )
  );

  const root = React.createElement(Root, { store, history, model, routes });
  ReactDOM.render(root, document.getElementById('app'));
  (store.dispatch as ThunkDispatch<unknown, void, AnyAction>)(Backend.start);
}

export function start(model: IAppModel): void {
  if (
    ['complete', 'loaded', 'interactive'].includes(document.readyState) &&
    document.body
  )
    init(model);
  else document.addEventListener('DOMContentLoaded', () => init(model), false);
}
