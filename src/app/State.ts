import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { IRootState, requestState, selectState } from '../backend';
import { useEffect, useState } from 'react';

interface IStateFetcherContext {
  add: (name: string) => void;
  remove: (name: string) => void;
  use: (name: string) => () => void;
}

export const StateFetcherContext = React.createContext<
  IStateFetcherContext | undefined
>(undefined);

export const ModuleStateProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [map] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    const intervalHandle = window.setInterval(() => {
      Object.keys(map).forEach((k) => requestState(k));
    }, 1000);
    return () => window.clearInterval(intervalHandle);
  }, []);
  const add = (name: string) => {
    let i = map[name] || 0;
    map[name] = ++i;
  };
  const remove = (name: string) => {
    let i = map[name] || 0;
    if (i) i--;
    if (i) map[name] = i;
    else delete map[name];
  };
  const use = (name: string) => {
    add(name);
    return () => remove(name);
  };
  return React.createElement(StateFetcherContext.Provider, {
    value: { add, remove, use },
    children,
  });
};

interface IUseModuleOptions {
  condition?: boolean;
  once?: boolean;
}

export const useModuleState = <T>(
  name: string,
  options?: IUseModuleOptions
): T => {
  const ctx = useContext(StateFetcherContext);
  if (ctx) {
    const deps = [];
    const { condition, once } = options || {};
    if (condition !== undefined) deps.push(condition);
    useEffect(() => {
      if (once) requestState(name);
      else if (condition === undefined || condition) return ctx.use(name);
    }, deps);
  }
  return useSelector<IRootState, T>((state) =>
    selectState<T>(state, name)
  );
};
