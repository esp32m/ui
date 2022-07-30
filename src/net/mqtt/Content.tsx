import { Grid } from '@mui/material';

import Config from './Config';
import State from './State';

export default () => (
  <Grid container>
    <State />
    <Config />
  </Grid>
);
