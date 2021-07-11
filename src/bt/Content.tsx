import React from 'react';
import { Plugins } from '..';
import { Grid } from '@material-ui/core';

export default function Content(): JSX.Element {
  const widgets: Array<React.ReactElement> = [];
  const plugins = Plugins.all();
  plugins.forEach((p, i) => {
    const bt = p.bt as { content: React.ComponentType; props: unknown };
    if (bt?.content)
      widgets.push(
        React.createElement(
          bt.content,
          Object.assign({ key: 'bt' + i }, bt.props)
        )
      );
  });

  return <Grid container>{widgets}</Grid>;
}
