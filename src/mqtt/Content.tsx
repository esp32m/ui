import React from 'react';
import { Grid } from '@material-ui/core';

import Config from './Config';
import State from './State';

export default () => (
  <Grid container>
    <State />
    <Config />
  </Grid>
);
