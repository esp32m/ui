import React from 'react';
import { connect } from 'react-redux';
import { Plugins } from '../plugins';
import * as Backend from '../backend';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  Box,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { AnyAction } from 'redux';
import { useModuleState } from '.';
import isBoolean from 'lodash/isBoolean';

const Name = 'ota';

interface IOtaState {
  method: string;
  progress: number;
  total: number;
}

interface IRootState extends Backend.IRootState {
  [Name]: IState;
}

interface IState {
  running?: boolean;
}

interface IProps {
  state: IOtaState;
  isRunning: boolean;
  reload: boolean;
}

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

export const isOtaRunning = (state: IRootState): boolean => {
  const r = state?.[Name]?.running;
  if (isBoolean(r)) return r;
  return !!Backend.selectState<IOtaState>(state, Name)?.method;
};

export const isReloadRequired = (state: IRootState): boolean => {
  return state?.[Name]?.running === false;
};

const useStyles = makeStyles({
  progressDialog: {
    flexGrow: 1,
  },
  percent: {
    textAlign: 'right',
  },
  progressBox: {
    margin: 24,
  },
});

export const OtaProgress = connect((state: IRootState) => ({
  state: Backend.selectState<IOtaState>(state, Name),
  isRunning: isOtaRunning(state),
  reload: isReloadRequired(state),
}))(({ state, isRunning, reload }: IProps) => {
  React.useEffect(() => {
    if (reload) setTimeout(() => window.location.reload(), 3000); // wait at least 3 sec for the chip to boot and reconnect
  }, [reload]);
  useModuleState(Name, { condition: isRunning });
  const classes = useStyles();
  const percent =
    state && state.total ? (state.progress * 100) / state.total : 0;
  return (
    <Dialog open={isRunning} className={classes.progressDialog}>
      <DialogTitle>Firmware update is in progress</DialogTitle>
      <Box display="flex" alignItems="center" className={classes.progressBox}>
        <Box width="100%" mr={1}>
          <BorderLinearProgress variant="determinate" value={percent} />
        </Box>
        <Box minWidth={35}>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.percent}
          >{`${Math.round(percent)}%`}</Typography>
        </Box>
      </Box>
    </Dialog>
  );
});

const reducer = (state: IState = {}, { type, payload }: AnyAction) => {
  if (payload?.source == Name)
    if (type == 'backend/broadcast')
      switch (payload.name) {
        case 'begin':
          return { ...state, running: true };
        case 'end':
          return { ...state, running: false };
      }
    else if (
      type == 'backend/response' &&
      payload.name == 'state-get' &&
      state.running &&
      !(payload?.data as IOtaState)?.method
    ) {
      return { ...state, running: false };
    }
  return state;
};

Plugins.register({ name: Name, reducer });
