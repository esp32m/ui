import React from 'react';
import { getIn } from 'formik';
import { TextField } from '@material-ui/core';

import { ILookProps } from './MuiField';

export function LookTextBase(props: ILookProps) {
  const { field, controller, componentProps, ...rest } = props;
  const {
    values,
    errors,
    touched,
    handleChange: onChange,
    handleBlur: onBlur,
  } = controller;
  const { name, label } = field;
  const wasTouched = getIn(touched, name);
  const errorText = getIn(errors, name);
  const error = !!(wasTouched && errorText);
  let value = getIn(values, name);
  if (value == null) value = ''; // covers null and undefined
  const p = {
    error,
    label,
    name,
    value,
    onChange,
    onBlur,
    helperText: wasTouched && errorText,
    ...rest,
    ...componentProps,
  };
  return <TextField {...p} />;
}
