import React from 'react';
import { IPlugin } from '../plugins';

export interface IDevicePlugin extends IPlugin {
  device?: {
    component: React.ComponentType;
    props?: React.Attributes;
  };
}
