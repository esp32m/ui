import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { FormikConsumer } from 'formik';
import {
  Grid,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@material-ui/core';

import { Name, ISystemConfig } from './types';
import {
  Backend,
  WidgetBox,
  Expander,
  MuiField,
  validators,
  ConfigBox,
  useAlert,
  useConfig,
} from '..';

interface IProps {
  config: ISystemConfig;
}

const FreqOptions = [
  [undefined, 'Default'],
  [240, '240 MHz'],
  [160, '160 MHz'],
  [80, '80 MHz'],
];

const FreqField = ({ i }: { i: number }) => (
  <MuiField
    look="select"
    fullWidth
    name={'pm.' + i}
    label={(i ? 'Min' : 'Max') + '. CPU frequency'}
  >
    {FreqOptions.map((o) => (
      <MenuItem key={o[0] || '_'} value={o[0]}>
        {o[1]}
      </MenuItem>
    ))}
  </MuiField>
);

function Settings({ config }: IProps) {
  const refreshConfig = useConfig(Name);
  if (!config) return null;

  return (
    <ConfigBox name={'esp32'} initial={config} title="System settings">
      <FormikConsumer>
        {(controller) => (
          <>
            <Expander title="Power management" defaultExpanded>
              <Grid item xs>
                <MuiField
                  look="switch"
                  name="pm.2"
                  label="Use Dynamic Frequency Scaling (light sleep)"
                />
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs>
                  <FreqField i={0} />
                </Grid>
                <Grid item xs>
                  <FreqField i={1} />
                </Grid>
              </Grid>
            </Expander>
          </>
        )}
      </FormikConsumer>
    </ConfigBox>
  );
}

export default connect((state: Backend.IRootState) => ({
  config: Backend.selectConfig<ISystemConfig>(state, 'esp32'),
}))(Settings);
