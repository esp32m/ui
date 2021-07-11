import React from 'react';
import { IPlugin } from '../plugins';

export interface IScannerPlugin extends IPlugin {
  scanner?: {
    component: React.ComponentType;
    props?: React.Attributes;
  };
}
