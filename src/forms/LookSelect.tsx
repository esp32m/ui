import React from 'react';
import { ILookProps, MuiFieldLook } from './MuiField';
import { Plugins } from '../plugins';
import { LookTextBase } from './LookTextBase';

export const Name = 'select';

export default function Look(props: ILookProps) {
  const { componentProps } = props;
  const p = { ...props, select: true, componentProps: { ...componentProps } };
  return <LookTextBase {...p} />;
}

Plugins.register({
  name: `${MuiFieldLook}-${Name}`,
  component: Look,
});
