import React from 'react';
import { Switch, FormControlLabel } from '@material-ui/core';
import { getIn } from 'formik';

import { Plugins } from '../plugins';

import { ILookProps, MuiFieldLook } from './MuiField';

export const LookSwitchName = 'switch';

export function LookSwitch(props: ILookProps) {
  const { field, controller, componentProps } = props;
  const {
    values,
    errors,
    touched,
    handleChange: onChange,
    handleBlur: onBlur,
  } = controller;
  const { name, label } = field;
  const error = !!(getIn(errors, name) && getIn(touched, name));
  let checked = getIn(values, name);
  if (checked === undefined) checked = false;
  const p = {
    name,
    checked,
    onChange,
    onBlur,
    ...componentProps,
  };
  return <FormControlLabel control={<Switch {...p} />} label={label} />;
}

Plugins.register({
  name: `${MuiFieldLook}-${LookSwitchName}`,
  component: LookSwitch,
});
