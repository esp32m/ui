import React from 'react';
import { IPlugin } from '../plugins';

export interface IDevicePlugin<P extends Record<string, unknown> = any>
  extends IPlugin {
  device?: {
    component: React.ComponentType<P>;
    props?: P;
  };
}
