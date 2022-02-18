import React from 'react';
import { ISlaveState, IProps } from './types';
import * as Backend from '../../backend';
import { WidgetBox, useModuleState } from '../..';
import { Slider, Grid } from '@mui/material';

export default ({ name, title }: IProps) => {
  const state = useModuleState<ISlaveState>(name);
  const [disabled, setDisabled] = React.useState(false);
  if (!state) return null;

  return (
    <WidgetBox title={title || name}>
      <Grid container>
        <Grid item xs={12}>
          <Slider
            min={state.hvac.bounds?.ch?.[0] || 0}
            max={state.hvac.bounds?.ch?.[1] || 100}
            valueLabelDisplay="auto"
            value={state.hvac.maxts}
            onChange={(event, maxts) => {
              setDisabled(true);
              Backend.setState(name, { hvac: { maxts } }).finally(() =>
                setDisabled(false)
              );
            }}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </WidgetBox>
  );
};
