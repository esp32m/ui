import React from 'react';
import { IPlugin } from '../plugins';

export interface IDebugPlugin extends IPlugin {
  debug?: {
    content: React.ComponentType;
    props?: React.Attributes;
  };
}
