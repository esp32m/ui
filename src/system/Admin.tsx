import React from 'react';

import * as Backend from '../backend';
import { WidgetBox, useMessageBox, MessageBox } from '..';
import {
  Button,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Name = 'app';
const requestRestart = () =>
  Backend.request(Name, 'restart').then(() => window.location.reload());
const requestReset = () =>
  Backend.request(Name, 'reset').then(() => window.location.reload());
const requestUpdate = (url: string) =>
  Backend.request('ota', 'update', { url });

const UpdateButton=styled(Button)({ bottom: 0, right: 0, position: 'absolute' });
const ButtonBar=styled(Grid)({ marginTop: 48 });

export default () => {
  const [fwurl, setFwurl] = React.useState<string>('');
  const { messageBoxProps, open } = useMessageBox({
    restart: {
      title: 'Do you really want to restart the chip ?',
      actions: [{ name: 'yes', onClick: requestRestart }, 'no'],
    },
    reset: {
      title: 'Do you really want to reset settings to their defaults ?',
      actions: [{ name: 'yes', onClick: requestReset }, 'no'],
    },
    update: {
      title: 'Do you really want to perform firmware update ?',
      actions: [{ name: 'yes', onClick: () => requestUpdate(fwurl) }, 'no'],
    },
  });
  React.useEffect(() => {
    Backend.requestConfig('ota').then((s) => {
      if (s.data?.url) setFwurl(s.data?.url);
    });
  }, []);
  return (
    <WidgetBox title="Administration">
      <Grid container>
        <Grid item xs>
          <TextField
            fullWidth
            variant="standard"
            label="Firmware URL"
            value={fwurl}
            onChange={(e) => setFwurl(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <UpdateButton
                    onClick={() => open('update')}
                    disabled={!fwurl}
                  >
                    Update
                  </UpdateButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <ButtonBar
        container
        justifyContent="flex-end"
        spacing={4}
      >
        <Grid item>
          <Button onClick={() => open('restart')}>System Restart</Button>
        </Grid>
        <Grid item>
          <Button onClick={() => open('reset')}>Reset settings</Button>
        </Grid>
      </ButtonBar>
      <MessageBox {...messageBoxProps} />
    </WidgetBox>
  );
};
