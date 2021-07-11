import React from 'react';
import { ILookProps, MuiFieldLook } from './MuiField';
import { Plugins } from '../plugins';
import { LookTextBase } from './LookTextBase';

export const LookPasswordName = 'password';

export function LookPassword(props: ILookProps) {
  const { componentProps } = props;
  const p = {
    ...props,
    componentProps: { ...componentProps, type: LookPasswordName },
  };
  return <LookTextBase {...p} />;
}

Plugins.register({
  name: `${MuiFieldLook}-${LookPasswordName}`,
  component: LookPassword,
});
