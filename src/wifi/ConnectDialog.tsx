import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  DialogProps,
} from '@mui/material';
import { FieldPassword, FieldText, MuiForm } from '../forms';
import { requestConnect } from './utils';

export interface IProps {
  open: boolean;
  ssid: string;
  ssidEditable?: boolean;
  bssid: string;
  onClose: () => void;
}

function ConnectDialog(props: IProps) {
  const { ssid, bssid, open, onClose, ssidEditable } = props;

  const handleSubmit = async (values: any) => {
    await requestConnect(values.ssid, values.bssid, values.password);
    onClose();
  };
  const initial = { ssid, bssid, password: '' };
  const dp: DialogProps = { open, onClose };
  return (
    <Dialog {...dp}>
      <DialogTitle>Connect to WiFi Access Point</DialogTitle>
      <DialogContent>
        <MuiForm initial={initial} onSubmit={handleSubmit} enableReinitialize={false}>
          {(controller) => {
            return (
              <>
                <FieldText
                  name="ssid"
                  label="SSID"
                  disabled={!ssidEditable}
                  fullWidth
                />
                <FieldText name="bssid" label="BSSID" fullWidth />
                <FieldPassword
                  name="password"
                  label="Password"
                  fullWidth
                  revealable
                />
                <DialogActions>
                  <Button onClick={() => onClose()} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => controller.submitForm()}
                    color="primary"
                  >
                    Connect
                  </Button>
                </DialogActions>
              </>
            );
          }}
        </MuiForm>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectDialog;
