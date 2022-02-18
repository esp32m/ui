import { getIn, useFormikContext } from 'formik';
import { TextField, Autocomplete, TextFieldProps } from '@mui/material';
import { FormValues, FieldProps } from './types';

export default (props: FieldProps<TextFieldProps> & { autocompleteProps: any })=> {
  const { name, label, autocompleteProps, ...rest } = props;
  const controller = useFormikContext<FormValues>();
  const {
    values,
    errors,
    touched,
    handleChange: onChange,
    handleBlur: onBlur,
  } = controller;
  const error = name && !!(getIn(errors, name) && getIn(touched, name));
  let value = name && getIn(values, name);
  if (value === undefined) value = '';
  const tp = {
    error,
    label,
    name,
    onBlur,
    helperText: error && errors[name],
    ...rest,
  };

  const p = {
    value,
    onChange,
    renderInput: (params: any) => <TextField {...params} {...tp} />,
    ...autocompleteProps,
  };
  return <Autocomplete {...p} />;
}
