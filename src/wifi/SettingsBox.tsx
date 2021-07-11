import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { FormikConsumer } from 'formik';
import {
  Grid,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import {
  IWifiConfig,
  Name,
  WifiPower,
  ApEntries,
  ApEntryFlags,
  IRootState,
} from './types';
import {
  Backend,
  WidgetBox,
  Expander,
  MuiField,
  validators,
  ConfigBox,
  useAlert,
  Alert,
  useConfig,
} from '..';
import { requestDeleteAp } from './utils';

interface IProps {
  config: IWifiConfig;
}

const PowerOptions = [
  [undefined, 'Default'],
  [WifiPower.dBm_19_5, '19.5 dBm'],
  [WifiPower.dBm_19, '19 dBm'],
  [WifiPower.dBm_18_5, '18.5 dBm'],
  [WifiPower.dBm_17, '17 dBm'],
  [WifiPower.dBm_15, '15 dBm'],
  [WifiPower.dBm_13, '13 dBm'],
  [WifiPower.dBm_11, '11 dBm'],
  [WifiPower.dBm_8_5, '8.5 dBm'],
  [WifiPower.dBm_7, '7 dBm'],
  [WifiPower.dBm_5, '5 dBm'],
  [WifiPower.dBm_2, '2 dBm'],
  [WifiPower.dBm_minus_1, '-1 dBm'],
];

function SavedAps({
  aps,
  refreshConfig,
}: {
  aps?: ApEntries;
  refreshConfig: () => void;
}) {
  if (!aps?.length) return null;
  const { alertProps, check } = useAlert();

  return (
    <Expander title="Saved access points">
      <Alert {...alertProps} />
      <List disablePadding>
        {aps.map((r, i) => {
          const [id, ssid, , flags, failcount, bssid] = r;
          const persistent = flags & ApEntryFlags.Fallback;
          let text = ssid;
          if (failcount) text += ` (${failcount} failures)`;
          return (
            <ListItem key={'row' + i}>
              <ListItemText primary={ssid} secondary={bssid} />
              {!persistent && (
                <IconButton
                  aria-label="delete"
                  onClick={() => check(requestDeleteAp(id).then(refreshConfig))}
                >
                  <Delete />
                </IconButton>
              )}
            </ListItem>
          );
        })}
      </List>
    </Expander>
  );
}

const ipcv = Yup.object().shape({
  ip: validators.ipv4,
  mask: validators.ipv4,
  gw: validators.ipv4,
});

const ValidationSchema = Yup.object().shape({
  sta: ipcv,
  ap: ipcv,
});

function Settings({ config }: IProps) {
  const refreshConfig = useConfig(Name);
  if (!config) return null;

  return (
    <ConfigBox
      name={Name}
      initial={config}
      title="WiFi settings"
      validationSchema={ValidationSchema}
    >
      <FormikConsumer>
        {(controller) => (
          <>
            <Expander title="Station">
              <MuiField look="switch" name="sta.dhcp" label="Use DHCP" />
              {!controller.values.sta?.dhcp && (
                <Grid container spacing={3}>
                  <Grid item xs>
                    <MuiField name="sta.ip" label="IP address" />
                  </Grid>
                  <Grid item xs>
                    <MuiField name="sta.mask" label="Netmask" />
                  </Grid>
                  <Grid item xs>
                    <MuiField name="sta.gw" label="Gateway" />
                  </Grid>
                </Grid>
              )}
            </Expander>
            <Expander title="Access point">
              <Grid container spacing={3}>
                <Grid item xs>
                  <MuiField name="ap.ip" label="IP address" />
                </Grid>
                <Grid item xs>
                  <MuiField name="ap.mask" label="Netmask" />
                </Grid>
                <Grid item xs>
                  <MuiField name="ap.gw" label="Gateway" />
                </Grid>
              </Grid>
            </Expander>
            <Expander title="Time synchronization">
              <MuiField look="switch" name="time.ntp" label="Use NTP" />
              {controller.values.time?.ntp && (
                <Grid container spacing={3}>
                  <Grid item xs>
                    <MuiField name="time.host" label="NTP hostname" />
                  </Grid>
                  <Grid item xs>
                    <MuiField
                      look="tzofs"
                      name="time.tz"
                      label="Time zone offset"
                    />
                  </Grid>
                  <Grid item xs>
                    <MuiField look="tzofs" name="time.dst" label="DST offset" />
                  </Grid>
                </Grid>
              )}
            </Expander>
            <Expander title="Advanced">
              <MuiField look="select" fullWidth name="txp" label="TX power">
                {PowerOptions.map((o) => (
                  <MenuItem key={o[0] || '_'} value={o[0]}>
                    {o[1]}
                  </MenuItem>
                ))}
              </MuiField>
            </Expander>
            <SavedAps aps={config.aps} refreshConfig={refreshConfig} />
          </>
        )}
      </FormikConsumer>
    </ConfigBox>
  );
}

export default connect((state: IRootState) => ({
  config: Backend.selectConfig<IWifiConfig>(state, Name),
}))(Settings);
