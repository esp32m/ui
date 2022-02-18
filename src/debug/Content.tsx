import React, { useMemo } from 'react';
import { usePlugins } from '..';
import { Grid } from '@mui/material';
import { IDebugPlugin } from './types';

export default () => {
  const plugins = usePlugins<IDebugPlugin>();
  const widgets: Array<React.ReactElement> = useMemo(
    () =>
      plugins
        .filter((p) => !!p.debug?.content)
        .map(({ debug }, i) =>
          React.createElement(
            debug.content,
            Object.assign({ key: 'debug_' + i }, debug.props)
          )
        ),
    [plugins]
  );
  return <Grid container>{widgets}</Grid>;
};
