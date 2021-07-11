import React from 'react';
import { StateFetcherContext } from './types';
import { requestState } from '../backend';
import { useEffect, useState } from 'react';

const StateFetcher = ({ children }: React.PropsWithChildren<{}>) => {
  const [map] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    const intervalHandle = window.setInterval(() => {
      Object.keys(map).forEach((k) => requestState(k));
    }, 1000);
    return () => window.clearInterval(intervalHandle);
  }, []);
  const _map: { [key: string]: boolean } = {};
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
  return (
    <StateFetcherContext.Provider value={{ add, remove, use }}>
      {children}
    </StateFetcherContext.Provider>
  );
};

export default StateFetcher;
