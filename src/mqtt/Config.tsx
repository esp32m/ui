import React from 'react';
import * as Yup from 'yup';
import { FormikProps } from 'formik';
import { connect } from 'react-redux';
import { FormikConsumer } from 'formik';
import { Grid } from '@material-ui/core';

import { IMqttConfig, Name } from './types';
import {
  Backend,
  WidgetBox,
  MuiField,
  validators,
  ConfigBox,
  useAlert,
  useConfig,
} from '..';

interface IProps {
  config: IMqttConfig;
}

const ValidationSchema = Yup.object().shape({
  keepalive: Yup.number().min(0),
  timeout: Yup.number().min(0),
});

function Config({ config }: IProps) {
  useConfig(Name);
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
            <MuiField look="switch" name="enabled" label="Enable MQTT client" />
            {controller.values.enabled && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <MuiField name="uri" label="URL" fullWidth />
                  </Grid>
                  <Grid item xs>
                    <MuiField name="client" label="Client name" fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <MuiField name="username" label="Username" fullWidth />
                  </Grid>
                  <Grid item xs>
                    <MuiField name="password" label="Password" fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <MuiField
                      name="keepalive"
                      label="Keep alive period, s"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <MuiField
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
}

export default connect((state: Backend.IRootState) => ({
  config: Backend.selectConfig<IMqttConfig>(state, Name),
}))(Config);
