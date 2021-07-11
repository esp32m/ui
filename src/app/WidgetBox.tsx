import React, { ReactChildren } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid, Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    width: 560,
    minWidth: 400,
    maxWidth: 640,
    margin: 20,
  },
  action: {
    margin: 0,
  },
  divider: {
    marginTop: 4,
  },
});

interface IProps {
  title?: any;
  header?: React.ComponentType;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  progress?: boolean | number;
}

function WidgetBox({
  title,
  header,
  children,
  avatar,
  action,
  progress,
}: React.PropsWithChildren<IProps>) {
  const classes = useStyles();
  let pc;
  switch (typeof progress) {
    case 'boolean':
      if (progress) pc = <LinearProgress />;
      break;
    case 'number':
      pc = <LinearProgress variant="determinate" value={progress} />;
      break;
  }
  if (!pc) pc = <Divider className={classes.divider} />;
  let h: any = header;
  if (!h && title) {
    h = (
      <>
        <CardHeader
          classes={{ action: classes.action }}
          avatar={avatar || <Avatar>{title[0]}</Avatar>}
          title={title}
          titleTypographyProps={{ variant: 'h5' }}
          action={action}
        />
        {pc}
      </>
    );
  }
  return (
    <Grid item>
      <Card className={classes.card}>
        {h}
        <CardContent>{children}</CardContent>
        <div />
      </Card>
    </Grid>
  );
}

export default WidgetBox;
