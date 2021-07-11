import React from 'react';
import { Grid } from '@material-ui/core';

import HardwareSummary from './HardwareSummary';
import AppSummary from './AppSummary';
import Admin from './Admin';
import Settings from './Settings';

export default () => (
  <Grid container>
    <AppSummary />
    <HardwareSummary />
    <Admin />
    <Settings />
  </Grid>
);
