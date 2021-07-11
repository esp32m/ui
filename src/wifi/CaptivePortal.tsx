import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import { Plugins } from '../plugins';

import ScannerBox from './ScannerBox';
import StaInfoBox from './StaInfoBox';
import ApInfoBox from './ApInfoBox';

const CaptivePortal = () => (
  <Grid container>
    <StaInfoBox />
    <ApInfoBox />
    <ScannerBox />
  </Grid>
);

export const useCaptivePortal = () => {
  Plugins.register({
    name: 'cp',
    content: { component: CaptivePortal },
    routes: [
      (p: any) => (
        <Route
          exact
          path="/generate_204"
          {...p}
          render={() => <Redirect to="/cp" />}
        />
      ),
    ],
  });
};
