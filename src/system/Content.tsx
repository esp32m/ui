import { Grid } from '@mui/material';

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
