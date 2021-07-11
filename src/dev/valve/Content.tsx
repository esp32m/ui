import React from 'react';
import { connect } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import { IState, IProps, ValveState } from './types';
import * as Backend from '../../backend';
import { WidgetBox, useModuleState } from '../../app';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

interface IButtonsProps {
  state: ValveState;
  onChange: (s: ValveState) => void;
  disabled: boolean;
}

const useStyles = makeStyles({
  title: { alignSelf: 'center' },
  buttons: { marginLeft: 'auto' },
});

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

export default connect((state: any, props: IProps) => ({
  state: Backend.selectState<IState>(state, props.name),
}))(({ name, title, state }: { state: IState } & IProps) => {
  useModuleState(name);
  const classes = useStyles();
  const [disabled, setDisabled] = React.useState(false);
  if (!state) return null;

  return (
    <WidgetBox title={title || name}>
      <Grid container>
        <Grid item className={classes.title}>
          {' '}
          {`State: ${state.state}`}{' '}
        </Grid>
        <Grid item className={classes.buttons}>
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
        </Grid>
      </Grid>
    </WidgetBox>
  );
});
