import { Dashboard, useDefaultHome } from './dashboard';
import { IAppModel } from './app/types';
import { start } from './app';
import { Plugins } from './plugins';

export function startUi(model?: IAppModel): void {
  if (!Plugins.find('home')) useDefaultHome();
  start(Object.assign({}, { root: () => Dashboard }, model));
}
