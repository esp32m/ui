import React from 'react';
import { IState, IProps } from './types';
import * as Backend from '../../backend';
import { WidgetBox, useModuleState } from '../..';
import { Slider, Grid } from '@mui/material';

export default ({ name, title }: IProps) => {
  const state = useModuleState<IState>(name);
  const [disabled, setDisabled] = React.useState(false);
  if (!state) return null;

  return (
    <WidgetBox title={title || name}>
      <Grid container>
        <Grid item xs={12}>
          <Slider
            min={0}
            max={180}
            valueLabelDisplay="auto"
            value={state.angle}
            onChange={(event, angle) => {
              setDisabled(true);
              Backend.setState(name, { angle }).finally(() =>
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
