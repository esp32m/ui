import React from 'react';
import { Grid } from '@material-ui/core';

import ScannerBox from './ScannerBox';
import StaInfoBox from './StaInfoBox';
import ApInfoBox from './ApInfoBox';
import SettingsBox from './SettingsBox';

export default () => (
  <Grid container>
    <StaInfoBox />
    <ApInfoBox />
    <SettingsBox />
    <ScannerBox />
  </Grid>
);
