import { MuiFieldLook } from './MuiField';
import { Plugins } from '../plugins';
import { LookTextBase } from './LookTextBase';

export const LookTextName = 'text';

Plugins.register({
  name: `${MuiFieldLook}-${LookTextName}`,
  component: LookTextBase,
});
