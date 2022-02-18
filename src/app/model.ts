import { createContext, useContext } from 'react';
import { IAppModel } from './types';

export const AppModelContext = createContext<IAppModel | undefined>(
  undefined
);

export const useAppModel = () => useContext(AppModelContext);
