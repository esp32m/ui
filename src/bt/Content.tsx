import React from 'react';
import { usePlugins, IPlugin } from '..';
import { Grid } from '@mui/material';
interface IBtPlugin extends IPlugin {
  bt: { content: React.ComponentType; props: unknown };
}

export default function Content(): JSX.Element {
  const plugins = usePlugins<IBtPlugin>();
  const widgets: Array<React.ReactElement> = React.useMemo(() => {
    return plugins
      .filter((p) => !!p.bt?.content)
      .map(({ bt }, i) =>
        React.createElement(
          bt.content,
          Object.assign({ key: 'bt' + i }, bt.props)
        )
      );
  }, [plugins]);
  return <Grid container>{widgets}</Grid>;
}
