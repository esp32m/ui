import React from 'react';
import { getIn } from 'formik';
import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import {
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputProps,
} from '@material-ui/core';

import { ILookProps, MuiFieldLook } from './MuiField';
import { Plugins } from '../plugins';

export const LookTzofsName = 'tzofs';

function min2hr(min: number) {
  const amin = Math.abs(min);
  return (
    (min < 0 ? '-' : '+') +
    ('' + amin / 60).padStart(2, '0') +
    ':' +
    ('' + (amin % 60)).padStart(2, '0')
  );
}

function hr2min(hr: string) {
  const m = /([+-])([01][0-9]):([0-5][0-9])/.exec(hr);
  if (!m) return null;
  let v = parseInt(m[2]) * 60 + parseInt(m[3]);
  if (m[1] == '-') v = -v;
  return v;
}

function TextMaskCustom(props: InputProps & MaskedInputProps) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        (inputRef as any)(ref ? ref.inputElement : null);
      }}
      mask={[/[+-]/, /[01]/, /[0-9]/, ':', /[0-5]/, /[0-9]/]}
      showMask
      guide={false}
      //            keepCharPositions
    />
  );
}

export function LookTzofs(props: ILookProps) {
  const { field, controller, componentProps } = props;
  const {
    values,
    errors,
    touched,
    handleChange: onChange,
    handleBlur: onBlur,
    setFieldValue,
  } = controller;
  const { name, label } = field;
  const error = !!(getIn(errors, name) && getIn(touched, name));
  let value = getIn(values, name);
  if (value === undefined) value = ''; // probably doesn't happen with formik's smart controller, but just to be safe
  value = min2hr(value);
  const id = `${LookTzofsName}-${name}`;
  const p = {
    error,
    label,
    name,
    value,
    onChange: (e: any) => setFieldValue(name, hr2min(e.target.value)),
    onBlur,
    helperText: error && errors[name],
    ...componentProps,
  };
  return <TextField InputProps={{ inputComponent: TextMaskCustom }} {...p} />;
}

Plugins.register({
  name: `${MuiFieldLook}-${LookTzofsName}`,
  component: LookTzofs,
});
