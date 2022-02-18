import React from 'react';
import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { IState, IProps, ValveState } from './types';
import * as Backend from '../../backend';
import { WidgetBox, useModuleState } from '../..';
import { styled } from '@mui/material/styles';

interface IButtonsProps {
  state: ValveState;
  onChange: (s: ValveState) => void;
  disabled: boolean;
}

const Title = styled(Grid)({ alignSelf: 'center' });
const StyledButtons = styled(Grid)({ marginLeft: 'auto' });

const Buttons = ({ state, onChange, disabled }: IButtonsProps) => {
  return (
    <ToggleButtonGroup exclusive value={state} onChange={(e, s) => onChange(s)}>
      <ToggleButton disabled={disabled} value={ValveState.Closed}>
        Close
      </ToggleButton>
      <ToggleButton disabled={disabled} value={ValveState.Open}>
        Open
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ({ name, title }: IProps) => {
  const state = useModuleState<IState>(name);
  const [disabled, setDisabled] = React.useState(false);
  if (!state) return null;

  return (
    <WidgetBox title={title || name}>
      <Grid container>
        <Title item> {`State: ${state.state}`} </Title>
        <StyledButtons item>
          <Buttons
            state={state.state}
            onChange={(state: ValveState) => {
              setDisabled(true);
              Backend.setState(name, { state }).finally(() =>
                setDisabled(false)
              );
            }}
            disabled={disabled}
          />
        </StyledButtons>
      </Grid>
    </WidgetBox>
  );
};
