import React from 'react';
import { Plugins } from '..';
import { Grid } from '@material-ui/core';
import { IDevicePlugin } from './types';

export default function Content(): JSX.Element {
  const widgets: Array<React.ReactElement> = [];
  const plugins = Plugins.all();
  plugins.forEach((p, i) => {
    const dp = p as IDevicePlugin;
    if (dp.device?.component)
      widgets.push(
        React.createElement(
          dp.device.component,
          Object.assign({ key: 'device_' + i }, dp.device.props)
        )
      );
  });

  return <Grid container>{widgets}</Grid>;
}
