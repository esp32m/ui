import React from 'react';
import { useSelector } from 'react-redux';
import { registerPlugin } from '../plugins';
import * as Backend from '../backend';
import {
  Dialog,
  DialogTitle,
  Box,
  LinearProgress,
  Typography,
} from '@mui/material';
import { AnyAction } from 'redux';
import { useModuleState } from '.';
import { isBoolean } from 'lodash';
import { styled } from '@mui/material/styles';

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

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  '& .MuiLinearProgress-root': {
    height: 10,
    borderRadius: 5,
  },
  '& .MuiLinearProgress-colorPrimary': {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 700],
  },
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}));

const isOtaRunning = (state: IRootState): boolean => {
  const r = state?.[Name]?.running;
  if (isBoolean(r)) return r;
  return !!Backend.selectState<IOtaState>(state, Name)?.method;
};

const isReloadRequired = (state: IRootState): boolean => {
  return state?.[Name]?.running === false;
};

const ProgressDialog = styled(Dialog)({
  flexGrow: 1,
});
const Percent = styled(Typography)({
  textAlign: 'right',
});
const ProgressBox = styled(Box)({
  margin: 24,
});

export const OtaProgress = () => {
  const isRunning = useSelector<IRootState, boolean>((state) =>
    isOtaRunning(state)
  );
  const reload = useSelector<IRootState, boolean>((state) =>
    isReloadRequired(state)
  );
  const state = useModuleState<IOtaState>(Name, { condition: isRunning });
  React.useEffect(() => {
    if (reload) setTimeout(() => window.location.reload(), 3000); // wait at least 3 sec for the chip to boot and reconnect
  }, [reload]);
  const percent =
    state && state.total ? (state.progress * 100) / state.total : 0;
  return (
    <ProgressDialog open={isRunning}>
      <DialogTitle>Firmware update is in progress</DialogTitle>
      <ProgressBox display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <BorderLinearProgress variant="determinate" value={percent} />
        </Box>
        <Box minWidth={35}>
          <Percent variant="body2" color="textSecondary">{`${Math.round(
            percent
          )}%`}</Percent>
        </Box>
      </ProgressBox>
    </ProgressDialog>
  );
};

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

registerPlugin({ name: Name, reducer });
