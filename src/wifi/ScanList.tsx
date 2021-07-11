import React, { useEffect, CSSProperties, useState } from 'react';
import { connect } from 'react-redux';

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  StyledComponentProps,
  Theme,
  createStyles,
  makeStyles,
  WithStyles,
} from '@material-ui/core';

import * as Backend from '../backend';
import { useModuleState } from '../app';
import {
  Name,
  IWifiState,
  ScanEntries,
  WifiStatus,
  WifiAuth,
  IRootState,
} from './types';
import { requestConnect, requestScan, select } from './utils';
import SignalIcon from './SignalIcon';
import ConnectDialog, { IProps as IConnectDialogProps } from './ConnectDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor:
          theme.palette.type === 'light'
            ? 'rgba(0, 0, 0, 0.07)' // grey[200]
            : 'rgba(255, 255, 255, 0.14)',
      },
    },
    connected: { fontWeight: 600 },
  })
);

interface IProps {
  scan: ScanEntries;
  state: IWifiState;
}

const ScanList = ({ scan, state }: IProps) => {
  useEffect(() => {
    const to = window.setTimeout(() => Backend.request(Name, 'scan'), 1000); // hack - do scan a bit later to allow for other ws requests to pass through on page load
    const interval = window.setInterval(requestScan, 30000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(to);
    };
  }, []);
  useModuleState(Name);
  const classes = useStyles();
  const [dialogProps, setDialogProps] = useState<IConnectDialogProps>({
    open: false,
    ssid: '',
    bssid: '',
    onClose: handleConnect,
  });

  function handleConnect(ssid?: string, bssid?: string, password?: string) {
    if (ssid) requestConnect(ssid, bssid, password);
    setDialogProps({ ...dialogProps, open: false });
  }

  function handleClick(ssid: string, bssid: string, auth: WifiAuth) {
    const open = !!auth;
    if (open) setDialogProps({ ...dialogProps, open: true, ssid, bssid });
    else requestConnect(ssid, bssid);
  }

  const { sta, status } = state || {};
  const scanning = !scan || !!(status & WifiStatus.Scanning);
  let scanTable;
  if (scan)
    scanTable = (
      <List>
        {scan.map((r, i) => {
          const [ssid, auth, rssi, ch, bssid] = r;
          const c =
            sta && ssid && bssid == sta.bssid ? classes.connected : undefined;
          return (
            <ListItem
              className={classes.root}
              key={'row' + i}
              onClick={() => handleClick(ssid, bssid, auth)}
            >
              <ListItemText
                classes={{ primary: c, secondary: c }}
                primary={ssid || '[hidden]'}
                secondary={bssid}
              />
              <ListItemIcon>
                <SignalIcon {...{ rssi, auth, ch, bssid }} />
              </ListItemIcon>
            </ListItem>
          );
        })}
      </List>
    );
  return (
    <>
      {scanTable}
      <ConnectDialog {...dialogProps} />
    </>
  );
};

export const UnconnectedScanList = ScanList;

export default connect((state: IRootState) => ({
  state: Backend.selectState<IWifiState>(state, Name),
  scan: select(state)?.scan,
}))(UnconnectedScanList);
