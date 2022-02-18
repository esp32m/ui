import { Route, Navigate } from 'react-router-dom';
import { Grid } from '@mui/material';

import { registerPlugin } from '../plugins';

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
  registerPlugin({
    name: 'cp',
    content: { component: CaptivePortal },
    routes: [
      (p: any) => (
        <Route
          path="/generate_204"
          {...p}
          element={<Navigate to="/cp" />}
        />
      ),
    ],
  });
};
