import React, { ReactElement, useEffect, useLayoutEffect } from 'react';
import {
  Formik,
  FormikProps,
  FormikConfig,
  FormikValues,
  isFunction,
} from 'formik';
import { ObjectShape } from 'yup/lib/object';
import { AnySchema } from 'yup/lib/schema';
import { ValidationContext } from './validation';
import { SubmitHandler } from './types';
import { debounce } from 'lodash';

interface IProps extends Partial<FormikConfig<FormikValues>> {
  initial: any;
  onSubmit: SubmitHandler;
}

/*function makeInitial(initial: any, yup: ObjectShape):FormikValues {
  if (!yup) return initial;
  const names = Object.keys(yup);
  if (!names.length) return initial;
  const result = names.reduce((a, n) => { if (!(n in a)) a[n] = undefined; return a; }, { ...initial || {} });
  return result;
}*/

export default function MuiForm(props: React.PropsWithChildren<IProps>) {
  /*const yup = React.useRef<ObjectShape>({});
  const [validationSchema, setValidationSchema] = React.useState<AnySchema | undefined>(undefined);
  const updateValidationSchema = React.useMemo(() => debounce((schema) => setValidationSchema(schema), 10), []);
  const addRule = (name: string, schema: AnySchema) => {
    yup.current[name] = schema;
    updateValidationSchema(Yup.object().shape(yup.current));
  }*/
  const { children, initial, onSubmit, ...other } = props;
  const fp = {
    initialValues: initial, //makeInitial(initial, yup.current),
    enableReinitialize: true,
    onSubmit,
    // validationSchema,
    ...other,
  };
  return <Formik {...fp}>{children}</Formik>;
  /*<ValidationContext.Provider value={{ yup: yup.current, addRule }}>
  </ValidationContext.Provider>;*/
}
