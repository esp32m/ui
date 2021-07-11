import React from 'react';
import { IPlugin } from '..';

interface IContent {
  title?: string;
  icon?: React.ComponentType;
  component: React.ComponentType;
}

export interface IContentPlugin extends IPlugin {
  content: IContent;
}
