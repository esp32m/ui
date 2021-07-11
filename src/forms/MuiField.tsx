import React from 'react';

import { useFormikContext, isFunction } from 'formik';
import * as Yup from 'yup';

import { IPlugin, Plugins } from '../plugins';
import { Y, ValidationContext } from './validation';
import { LookTextName } from './LookText';
import { IController, FormValues } from './types';

export const MuiFieldLook = 'mui-field-look';

const DY: Y = { string: Yup.string, number: Yup.number, object: Yup.object };

interface IFieldProps extends React.ComponentProps<any> {
  look?: string;
  name: string;
  label?: string;
  // yup?: Yup.SchemaOf<any> | ((y: Y) => Yup.SchemaOf<any>);
  componentProps?: React.ComponentProps<any>;
}

export interface ILookProps {
  field: IFieldProps;
  controller: IController;
  componentProps?: React.ComponentProps<any>;
}

export interface ILookPlugin extends IPlugin {
  component: React.ComponentType<ILookProps>;
}

export default function MuiField(props: React.PropsWithChildren<IFieldProps>) {
  const { yup, look, componentProps, children, name, label, ...rest } = props;
  const lp = Plugins.find<ILookPlugin>(
    `${MuiFieldLook}-${look || LookTextName}`
  );
  const C = lp?.component;
  if (!C) return null;
  const controller = useFormikContext<FormValues>();
  if (!controller) return null;
  /*const vc = React.useContext(ValidationContext);
  React.useEffect(() => {
    if (yup)
      vc.addRule(name, (isFunction(yup) ? yup(DY) : yup) as any)
  }, []);*/
  const { isSubmitting } = controller;
  const p: React.PropsWithChildren<ILookProps> = {
    field: { name, label },
    componentProps: { disabled: isSubmitting, ...(componentProps || {}) },
    controller,
    children,
    ...rest,
  };
  return <C {...p} />;
}
