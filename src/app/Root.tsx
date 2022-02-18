import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

import { IAppModel, RouteCreators } from './types';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import * as Backend from '../backend';
import { OtaProgress } from './Ota';
import { IRootState } from '../backend';
import { ModuleStateProvider } from './State';
import { CollapseDrawerProvider } from '../components/navbar';
import DashboardLayout from './DashboardLayout';
import { ThemeProvider } from '..';
import { AppModelContext } from './model';

const Center = styled('div')({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});

function WithBackend({ children }: React.PropsWithChildren<unknown>) {
  const socket = useSelector<IRootState>(
    (state) => Backend.select(state)?.socket
  );
  useEffect(() => {
    if (socket == Backend.SocketState.Connected) Backend.requestState('ota');
  }, [socket]);
  if (socket != Backend.SocketState.Connected) {
    return (
      <Center>
        <CircularProgress />
      </Center>
    );
  }
  return (
    <>
      {children}
      <OtaProgress />
    </>
  );
}

interface IProps {
  store: any;
  model: IAppModel;
  routes: RouteCreators;
}

const NotFound = () => <span>"Not Found!"</span>;

function Root(props: IProps) {
  const { store, model } = props;
  const C = model.root ? (model.root() as React.ElementType) : DashboardLayout;
  const routes = props.routes.map((r, i) => r({ key: 'route-' + i }));
  const content = (
    <WithBackend>
      <Routes>
        {routes}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route element={<NotFound />} />
      </Routes>
    </WithBackend>
  );
  return (
    <ThemeProvider>
      <AppModelContext.Provider value={model}>
        <CollapseDrawerProvider>
          <Provider store={store}>
            <BrowserRouter>
              <ModuleStateProvider>
                <C> {content} </C>
              </ModuleStateProvider>
            </BrowserRouter>
          </Provider>
        </CollapseDrawerProvider>
      </AppModelContext.Provider>
    </ThemeProvider>
  );
}

export default Root;
