import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Backend from '../backend';
import { OtaProgress } from './Ota';

const styles = () =>
  createStyles({
    center: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  backend: Backend.IState;
}

function WithBackend(props: React.PropsWithChildren<IProps>) {
  const { socket } = props.backend;
  useEffect(() => {
    if (socket == Backend.SocketState.Connected) Backend.requestState('ota');
  }, [socket]);
  if (socket != Backend.SocketState.Connected) {
    return (
      <div className={props.classes.center}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      {props.children}
      <OtaProgress />
    </>
  );
}

export default connect((state: Backend.IRootState) => ({
  backend: Backend.select(state),
}))(withStyles(styles)(WithBackend));
