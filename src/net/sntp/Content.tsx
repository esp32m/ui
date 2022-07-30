import * as Yup from 'yup';
import { Grid } from '@mui/material';

import { Name, IConfig, IState } from './types';
import {
  FieldText,
  ConfigBox,
  useModuleConfig,
  FieldSwitch,
  FieldTzofs,
  useModuleState,
  NameValueList,
} from '../..';

const ValidationSchema = Yup.object().shape({});
const StatusNames = ['reset', 'complete', 'in progress'];

export default () => {
  const state = useModuleState<IState>(Name);
  const [config] = useModuleConfig<IConfig>(Name);
  if (!config || !state) return null;
  const { status, time } = state;
  const list = [];
  list.push(['Synchronization state', StatusNames[status]]);
  if (time) list.push(['Current time', new Date(time * 1000).toLocaleString()]);
  return (
    <ConfigBox
      name={Name}
      initial={config}
      title="SNTP Time Synchronization"
      validationSchema={ValidationSchema}
    >
      <NameValueList list={list} />
      <FieldSwitch name="enabled" label="Enable SNTP time synchronization" />

      <Grid container spacing={3}>
        <Grid item xs>
          <FieldText name="host" label="NTP hostname" />
        </Grid>
        <Grid item xs>
          <FieldTzofs name="tz" label="Time zone offset" />
        </Grid>
        <Grid item xs>
          <FieldTzofs name="dst" label="DST offset" />
        </Grid>
      </Grid>
    </ConfigBox>
  );
};
