import { Bluetooth as icon } from '@mui/icons-material';
import Content from './Content';
import { IContentPlugin } from '../app/types';
import { ComponentType } from 'react';
import { IPlugin } from '../plugins';

export interface IBluetoothPlugin extends IPlugin {
  bt: { content: ComponentType };
}

export const Bluetooth: IContentPlugin = {
  name: 'bt',
  content: { title: 'Bluetooth', icon, component: Content },
};
