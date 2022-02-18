import React from 'react';
import { getIn, useFormikContext } from 'formik';
import { TextField, TextFieldProps } from '@mui/material';
import { IMaskInput } from 'react-imask';

import { FormValues, FieldProps } from './types';

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

/*function TextMaskCustom(props: InputProps & MaskedInputProps) {
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
*/
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        // @ts-ignore: hot fix for https://github.com/uNmAnNeR/imaskjs/issues/554
        mask="+10:50"
        definitions={{
          '+': /[+-]/,
          '1': /[01]/,
          '5': /[0-5]/,
        }}
        inputRef={ref as any}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

export default (props: FieldProps<TextFieldProps>) => {
  const { name, label, ...rest } = props;
  const controller = useFormikContext<FormValues>();
  const {
    values,
    errors,
    touched,
    handleBlur: onBlur,
    setFieldValue,
  } = controller;
  const error =  !!(name && getIn(errors, name) && getIn(touched, name));
  let value = name && getIn(values, name);
  if (value === undefined) value = ''; // probably doesn't happen with formik's smart controller, but just to be safe
  value = min2hr(value);
  const p : TextFieldProps = {
    error,
    label,
    name,
    value,
    variant: 'standard',
    onChange: (e: any) => {
      if (name != null) setFieldValue(name, hr2min(e.target.value));
    },
    onBlur,
    helperText: error && errors[name],
    ...rest,
  };
  return <TextField InputProps={{ inputComponent: TextMaskCustom as any}} {...p} />;
};
