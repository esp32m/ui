import React from 'react';
import { Plugins } from '..';
import { Grid } from '@material-ui/core';
import { IScannerPlugin } from './types';

export default function Scanners(): JSX.Element {
  const widgets: Array<React.ReactElement> = [];
  const plugins = Plugins.all();
  plugins.forEach((p, i) => {
    const bp = p as IScannerPlugin;
    if (bp.scanner?.component)
      widgets.push(
        React.createElement(
          bp.scanner?.component,
          Object.assign({ key: 'scanner_' + i }, bp.scanner?.props)
        )
      );
  });

  return <Grid container>{widgets}</Grid>;
}
