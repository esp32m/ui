import React, { useMemo } from 'react';
import { usePlugins } from '..';
import { Grid } from '@mui/material';
import { INetworkPlugin } from './types';
import { Interfaces } from './Interfaces';

export default () => {
  const plugins = usePlugins<INetworkPlugin>();
  const widgets: Array<React.ReactElement> = useMemo(
    () =>
      plugins
        .filter((p) => !!p.network?.content)
        .map(({ network }, i) =>
          React.createElement(
            network.content,
            Object.assign({ key: 'network_' + i }, network.props)
          )
        ),
    [plugins]
  );
  return <Grid container><Interfaces/>{widgets}</Grid>;
};
