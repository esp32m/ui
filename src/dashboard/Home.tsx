import React from 'react';
import { Grid } from '@material-ui/core';
import { Home } from '@material-ui/icons';

import { Plugins, SystemHealth, StaInfoBox, ApInfoBox, MqttStateBox } from '..';

const component = () => (
  <Grid container>
    <SystemHealth />
    <StaInfoBox />
    <ApInfoBox />
    <MqttStateBox />
  </Grid>
);

export default () => {
  Plugins.register({
    name: 'home',
    content: { icon: Home, title: 'Home', component },
  });
};
