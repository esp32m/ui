import React from 'react';
import { Plugins } from '..';
import { Grid } from '@material-ui/core';
import { IDebugPlugin } from './types';

export default () => {
  const widgets: Array<React.ReactElement> = [];
  const plugins = Plugins.all();
  plugins.forEach((p, i) => {
    const dp = p as IDebugPlugin;
    if (dp.debug?.content)
      widgets.push(
        React.createElement(
          dp.debug.content,
          Object.assign({ key: 'debug_' + i }, dp.debug.props)
        )
      );
  });

  return <Grid container>{widgets}</Grid>;
};
