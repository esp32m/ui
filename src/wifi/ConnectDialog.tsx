import React, { useState, useEffect } from 'react';

import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  Input,
  IconButton,
  InputAdornment,
} from '@material-ui/core';

export interface IProps {
  open: boolean;
  ssid: string;
  ssidEditable?: boolean;
  bssid: string;
  onClose: (ssid?: string, bssid?: string, password?: string) => void;
}

function ConnectDialog(props: IProps) {
  const [showPass, setShowPass] = useState(false);
  const [ssid, setSsid] = useState(props.ssid);
  const [bssid, setBssid] = useState(props.bssid);
  const [password, setPassword] = useState('');
  const { open, onClose, ssidEditable } = props;
  useEffect(() => {
    if (props.open) {
      setSsid(props.ssid);
      setBssid(props.bssid);
    }
  }, [props.open]);

  function handleClose(ok: boolean) {
    if (ok) onClose(ssid, bssid, password);
    else onClose();
  }

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Connect to WiFi Access Point</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="SSID"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          disabled={!ssidEditable}
        />
        <TextField
          fullWidth
          label="BSSID"
          value={bssid}
          onChange={(e) => setBssid(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel htmlFor="adornment-password">Password</InputLabel>
          <Input
            id="adornment-password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key == 'Enter') handleClose(true);
            }}
            autoFocus
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => handleClose(true)} color="primary">
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConnectDialog;
