import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import { IState, IProps, Mode } from './types';
import * as Backend from '../../backend';
import { useModuleState } from '../../app';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Grid, makeStyles } from '@material-ui/core';

interface IButtonsProps {
  mode: Mode;
  onChange: (m: Mode) => void;
  disabled: boolean;
}

const useStyles = makeStyles({
  title: { alignSelf: 'center' },
  buttons: { marginLeft: 'auto' },
});

const Buttons = ({ mode, onChange, disabled }: IButtonsProps) => {
  return (
    <ToggleButtonGroup exclusive value={mode} onChange={(e, m) => onChange(m)}>
      <ToggleButton disabled={disabled} value={Mode.Off}>
        OFF
      </ToggleButton>
      <ToggleButton disabled={disabled} value={Mode.Forward}>
        Forward
      </ToggleButton>
      <ToggleButton disabled={disabled} value={Mode.Reverse}>
        Reverse
      </ToggleButton>
      <ToggleButton disabled={disabled} value={Mode.Break}>
        Break
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
          mode={state.mode}
          onChange={(mode: Mode) => {
            setDisabled(true);
            Backend.setState(name, { mode }).finally(() => setDisabled(false));
          }}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
});
