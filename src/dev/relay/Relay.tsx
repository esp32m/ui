import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import { IState, IProps, RelayState } from './types';
import * as Backend from '../../backend';
import { useModuleState } from '../../app';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Grid, makeStyles } from '@material-ui/core';

interface IButtonsProps {
  state: RelayState;
  onChange: (s: RelayState) => void;
  disabled: boolean;
}

const useStyles = makeStyles({
  title: { alignSelf: 'center' },
  buttons: { marginLeft: 'auto' },
});

const Buttons = ({ state, onChange, disabled }: IButtonsProps) => {
  return (
    <ToggleButtonGroup exclusive value={state} onChange={(e, s) => onChange(s)}>
      <ToggleButton disabled={disabled} value={RelayState.Off}>
        Off
      </ToggleButton>
      <ToggleButton disabled={disabled} value={RelayState.On}>
        On
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
    <Grid container>
      <Grid item className={classes.title}>
        {' '}
        {title}{' '}
      </Grid>
      <Grid item className={classes.buttons}>
        <Buttons
          state={state.state}
          onChange={(state: RelayState) => {
            setDisabled(true);
            Backend.setState(name, { state }).finally(() => setDisabled(false));
          }}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
});
