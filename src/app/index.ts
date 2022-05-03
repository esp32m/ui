import React from 'react';
import { createRoot } from 'react-dom/client';
import { isArray } from 'lodash-es';
import {
  AnyAction,
  combineReducers,
  Reducer,
} from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Route } from 'react-router-dom';

import * as Backend from '../backend';
import { usePlugins } from '../plugins';
import { IAppModel, RouteCreators } from './types';
import { resolveFunction } from './utils';
import Root from './Root';
import { configureStore } from '@reduxjs/toolkit';

export * from './utils';
export { useAppModel } from './model';
export {
  Form as ConfigForm,
  Box as ConfigBox,
  useModuleConfig as useConfig,
} from './Config';
export { useModuleState } from './State';

interface IBuildInfo {
  version: string;
  built: string;
  mode: 'development' | 'production';
}

declare global {
  interface Window {
    // __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
    __build_info?: IBuildInfo;
  }
}

export const buildInfo = window.__build_info;

interface IReducers {
  [key: string]: Reducer;
}

function init(model: IAppModel) {
  const reducers: IReducers = {};
  const routes: RouteCreators = [];
  const plugins = usePlugins();
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
          element: React.createElement(
            (p.content as { component: React.ComponentType }).component
          ),
          key: p.name,
        })
      );
  });

  const reducer = combineReducers(reducers);
  /*const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducer,
    {},
    composeEnhancers(applyMiddleware(thunkMiddleware, Backend.middleware))
  );*/
  const store=configureStore({reducer, middleware: m => m().concat(Backend.middleware)});
  const rootElement = React.createElement(Root, { store, model, routes });
  const app = document.getElementById('app');
  if (app) {
    const root = createRoot(app);
    root.render(rootElement);
    (store.dispatch as ThunkDispatch<unknown, void, AnyAction>)(Backend.start);
  }
}

export function start(model: IAppModel): void {
  if (
    ['complete', 'loaded', 'interactive'].includes(document.readyState) &&
    document.body
  )
    init(model);
  else document.addEventListener('DOMContentLoaded', () => init(model), false);
}
