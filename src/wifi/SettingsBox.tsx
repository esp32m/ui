import * as Yup from 'yup';
import { FormikConsumer } from 'formik';
import {
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

import { IWifiConfig, Name, WifiPower, ApEntries, ApEntryFlags } from './types';
import { ConfigBox, useAlert, Alert, useModuleConfig, FieldSelect, Expander } from '..';
import { requestDeleteAp } from './utils';

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
              <ListItemText primary={text} secondary={bssid} />
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

const ValidationSchema = Yup.object().shape({});

export default () => {
  const [config, refreshConfig] = useModuleConfig<IWifiConfig>(Name);
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
            <FieldSelect fullWidth name="txp" label="TX power">
              {PowerOptions.map((o) => (
                <MenuItem key={o[0] || '_'} value={o[0]}>
                  {o[1]}
                </MenuItem>
              ))}
            </FieldSelect>

            <SavedAps aps={config.aps} refreshConfig={refreshConfig} />
          </>
        )}
      </FormikConsumer>
    </ConfigBox>
  );
};
