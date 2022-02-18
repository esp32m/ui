import { IPlugin } from '../..';

export interface IThemePlugin extends IPlugin {
  theme: Record<string, unknown>;
}
