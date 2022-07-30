import { Route, Navigate } from 'react-router-dom';
import { Grid } from '@mui/material';

import ScannerBox from './ScannerBox';
import StaInfoBox from './StaInfoBox';
import ApInfoBox from './ApInfoBox';
import { IContentPlugin, IRouterPlugin } from '../app/types';

const component = () => (
  <Grid container>
    <StaInfoBox />
    <ApInfoBox />
    <ScannerBox />
  </Grid>
);

export const CaptivePortal: IContentPlugin & IRouterPlugin = {
  name: 'cp',
  content: { component },
  routes: [
    (p) => (
      <Route path="/generate_204" {...p} element={<Navigate to="/cp" />} />
    ),
  ],
};
