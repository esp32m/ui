import React, { useMemo } from 'react';
import { usePlugins } from '..';
import { Grid } from '@mui/material';
import { IScannerPlugin } from './types';

export default function Scanners(): JSX.Element {
  const plugins = usePlugins<IScannerPlugin>();
  const widgets: Array<React.ReactElement> = useMemo(
    () =>
      plugins
        .filter((p) => !!p.scanner?.component)
        .map(({ scanner }, i) =>
          React.createElement(
            scanner.component,
            Object.assign({ key: 'scanner_' + i }, scanner?.props)
          )
        ),
    [plugins]
  );
  return <Grid container>{widgets}</Grid>;
}
