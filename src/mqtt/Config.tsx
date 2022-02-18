import * as Yup from 'yup';
import { FormikConsumer } from 'formik';
import { Grid } from '@mui/material';

import { IMqttConfig, Name } from './types';
import {
  FieldText,
  ConfigBox,
  useConfig,
  FieldSwitch,
  FieldPassword,
} from '..';

const ValidationSchema = Yup.object().shape({
  keepalive: Yup.number().min(0),
  timeout: Yup.number().min(0),
});

export default () => {
  const [config] = useConfig<IMqttConfig>(Name);
  if (!config) return null;

  return (
    <ConfigBox
      name={Name}
      initial={config}
      title="MQTT client settings"
      validationSchema={ValidationSchema}
    >
      <FormikConsumer>
        {(controller) => (
          <>
            <FieldSwitch name="enabled" label="Enable MQTT client" />
            {controller.values.enabled && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <FieldText name="uri" label="URL" fullWidth />
                  </Grid>
                  <Grid item xs>
                    <FieldText name="client" label="Client name" fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <FieldText name="username" label="Username" fullWidth />
                  </Grid>
                  <Grid item xs>
                    <FieldPassword name="password" label="Password" fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <FieldText
                      name="keepalive"
                      label="Keep alive period, s"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <FieldText
                      name="timeout"
                      label="Network timeout, s"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </>
        )}
      </FormikConsumer>
    </ConfigBox>
  );
};
