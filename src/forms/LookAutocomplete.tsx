import React from 'react';
import { getIn } from 'formik';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ILookProps, MuiFieldLook } from './MuiField';
import { Plugins } from '../plugins';

export const Name = 'autocomplete';

export default function Look(props: ILookProps & { autocompleteProps: any }) {
  const { field, controller, componentProps, autocompleteProps, ...rest } =
    props;
  const {
    values,
    errors,
    touched,
    handleChange: onChange,
    handleBlur: onBlur,
  } = controller;
  const { name, label } = field;
  const error = !!(getIn(errors, name) && getIn(touched, name));
  let value = getIn(values, name);
  if (value === undefined) value = '';
  const tp = {
    error,
    label,
    name,
    onBlur,
    helperText: error && errors[name],
    ...rest,
    ...componentProps,
  };

  const p = {
    value,
    onChange,
    renderInput: (params: any) => <TextField {...params} {...tp} />,
    ...autocompleteProps,
  };
  return <Autocomplete {...p} />;
}

Plugins.register({
  name: `${MuiFieldLook}-${Name}`,
  component: Look,
});
