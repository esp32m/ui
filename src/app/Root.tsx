import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { IAppModel, RouteCreators } from './types';
import WithBackend from './WithBackend';
import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import StateFetcher from './StateFetcher';

interface IProps {
  history: any;
  store: any;
  model: IAppModel;
  routes: RouteCreators;
}

const NotFound = () => <span>"Not Found!"</span>;

function Root(props: IProps) {
  const { store, history, model } = props;
  const C = model.root ? withRouter(model.root() as any) : React.Fragment;
  const routes = props.routes.map((r, i) => r({ key: 'route-' + i }));
  const content = (
    <WithBackend>
      <Switch>
        {routes}
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route component={NotFound} />
      </Switch>
    </WithBackend>
  );
  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <StateFetcher>
            <C> {content} </C>
          </StateFetcher>
        </ConnectedRouter>
      </Provider>
    </StylesProvider>
  );
}

export default Root;
