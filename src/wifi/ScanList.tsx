import  { useEffect,  useState } from 'react';
import { useSelector } from 'react-redux';

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
 } from '@mui/material';

import * as Backend from '../backend';
import { useModuleState } from '../app';
import {
  Name,
  IWifiState,
  ScanEntries,
  WifiAuth,
  IRootState,
} from './types';
import { requestConnect, requestScan, select } from './utils';
import SignalIcon from './SignalIcon';
import ConnectDialog, { IProps as IConnectDialogProps } from './ConnectDialog';
import { styled } from '@mui/material/styles';



const StyledListItem = styled(ListItem)(({theme})=>({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'rgba(0, 0, 0, 0.07)' // grey[200]
        : 'rgba(255, 255, 255, 0.14)',
  }
}));


export default () => {
  useEffect(() => {
    const to = window.setTimeout(() => Backend.request(Name, 'scan'), 1000); // hack - do scan a bit later to allow for other ws requests to pass through on page load
    const interval = window.setInterval(requestScan, 30000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(to);
    };
  }, []);
  const state=useModuleState<IWifiState>(Name);
  const scan=useSelector<IRootState, ScanEntries>(state=>select(state)?.scan);
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

  const { sta } = state || {};
  let scanTable;
  if (scan)
    scanTable = (
      <List>
        {scan.map((r, i) => {
          const [ssid, auth, rssi, ch, bssid] = r;
          const c =
            sta && ssid && bssid == sta.bssid ? { fontWeight: 600 } : {};
          return (
            <StyledListItem
              key={'row' + i}
              onClick={() => handleClick(ssid, bssid, auth)}
            >
              <ListItemText
                style={c}
                primary={ssid || '[hidden]'}
                secondary={bssid}
              />
              <ListItemIcon>
                <SignalIcon {...{ rssi, auth, ch, bssid }} />
              </ListItemIcon>
            </StyledListItem>
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


