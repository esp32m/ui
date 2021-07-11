import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { useFormikContext, FormikConsumer } from 'formik';
import {
  Button,
  Grid,
  MenuItem,
  Typography,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Divider,
  Tabs,
  Tab,
  Box,
  Paper,
} from '@material-ui/core';

import {
  MuiField,
  MuiForm,
  validators,
  WidgetBox,
  Backend,
  Alert,
  useAlert,
  useConfig,
} from '../..';

import { Name } from './types';

interface IOptions {
  from?: number;
  to?: number;
}

interface IScanResponse {
  progress?: number;
  addrs?: Array<number>;
}

const reqScan = (req?: IOptions) => Backend.request(Name, 'scan', req);
const reqRequest = (req?: IOptions) => Backend.request(Name, 'request', req);
const reqMonitor = (req?: IOptions) => Backend.request(Name, 'monitor', req);

const styles = (theme: Theme) =>
  createStyles({
    results: {
      marginTop: 16,
      padding: 16,
      paddingTop: 8,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.12)',
    },
    idsBox: {
      marginTop: 10,
    },
    scanDiv: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    scanButton: { position: 'absolute', bottom: 0, right: 0 },
    id: {
      textTransform: 'none',
    },
    resultMsg: {
      textAlign: 'center',
      width: '100%',
    },
  });

interface IProps {
  state: IOptions;
  resp: {
    scan?: IScanResponse;
    request?: any;
  };
}

const SubmitButton = withStyles(styles)(
  ({ classes, label }: WithStyles<typeof styles> & { label: string }) => {
    const { isSubmitting, submitForm } = useFormikContext();
    return (
      <div className={classes.scanDiv}>
        <Button
          variant="contained"
          className={classes.scanButton}
          disabled={isSubmitting}
          onClick={submitForm}
        >
          {label}
        </Button>
      </div>
    );
  }
);

const ScanResults = withStyles(styles)(
  ({ state, resp, classes }: IProps & WithStyles<typeof styles>) => {
    const { from = 1, to = 247 } = state;
    const { addrs = [] } = resp?.scan || {};
    const buttons = [];
    for (let i = from; i <= to; i++)
      if (addrs[i >> 3] & (1 << (i & 7)))
        buttons.push(
          <Grid item xs={2} key={i}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.id}
            >
              0x{i.toString(16)}
            </Button>
          </Grid>
        );
    const content = buttons.length ? (
      <Grid container spacing={3} wrap="wrap" className={classes.idsBox}>
        {buttons}
      </Grid>
    ) : (
      <Typography variant={'subtitle1'} className={classes.resultMsg}>
        {'No devices were detected!'}
      </Typography>
    );
    return (
      <div className={classes.results}>
        <Typography variant="subtitle1">Scan results</Typography>
        <Divider />
        {content}
      </div>
    );
  }
);

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const ValidationSchema = Yup.object().shape({
  from: validators.modbusAddr,
  to: validators.modbusAddr,
  addr: validators.modbusAddr,
});

function Widget(props: IProps) {
  const [tab, setTab] = useState(0);
  const { check, alertProps } = useAlert();
  const refreshConfig = useConfig(Name);

  const handleSubmit = async (values: any) => {
    switch (tab) {
      case 0:
        check(await reqScan(values));
        break;
      case 1:
        await check(reqRequest(values));
        break;
    }
    refreshConfig();
  };

  const ncp = {
    type: 'number',
    placeholder: 'auto',
    InputLabelProps: { shrink: true },
    fullWidth: true,
  };
  const { state = {}, resp = {} } = props;
  const { scan, request } = resp;
  return (
    <MuiForm
      initial={state}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
    >
      <FormikConsumer>
        {(controller) => {
          return (
            <WidgetBox
              title="MODBUS tools"
              progress={scan?.progress || controller.isSubmitting || false}
            >
              <Grid container spacing={3}>
                <Grid item xs>
                  <MuiField
                    look="select"
                    name="mode"
                    label="RS485 mode"
                    componentProps={ncp}
                  >
                    <MenuItem value="rtu">RTU</MenuItem>
                    <MenuItem value="ascii">ASCII</MenuItem>
                  </MuiField>
                </Grid>
                <Grid item xs>
                  <MuiField
                    look="select"
                    name="uart"
                    label="UART number"
                    componentProps={ncp}
                  >
                    <MenuItem value={0}>UART 0</MenuItem>
                    <MenuItem value={1}>UART 1</MenuItem>
                    <MenuItem value={2}>UART 2</MenuItem>
                  </MuiField>
                </Grid>
                <Grid item xs>
                  <MuiField
                    look="autocomplete"
                    name="baud"
                    label="Baud rate"
                    componentProps={ncp}
                    autocompleteProps={{
                      freeSolo: true,
                      options: [
                        2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200,
                      ],
                      getOptionLabel: (o: any) => o.toString(),
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <MuiField
                    look="select"
                    name="parity"
                    label="Parity"
                    componentProps={ncp}
                  >
                    <MenuItem value={0}>Disable</MenuItem>
                    <MenuItem value={2}>Even</MenuItem>
                    <MenuItem value={3}>Odd</MenuItem>
                  </MuiField>
                </Grid>
              </Grid>
              <div style={{ marginTop: 20 }} />
              <Paper square>
                <Tabs
                  variant="fullWidth"
                  value={tab}
                  onChange={(e, v) => setTab(v)}
                >
                  <Tab label="Scan" />
                  <Tab label="Request" />
                  <Tab label="Monitor" />
                </Tabs>
                <TabPanel value={tab} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs>
                      <MuiField
                        name="from"
                        label="From ID"
                        componentProps={ncp}
                      />
                    </Grid>
                    <Grid item xs>
                      <MuiField name="to" label="To ID" componentProps={ncp} />
                    </Grid>
                    <Grid item xs>
                      <SubmitButton label="Scan MODBUS" />
                    </Grid>
                  </Grid>
                  <Alert {...alertProps} />
                  {!!scan?.addrs && <ScanResults {...props} />}
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs>
                      <MuiField
                        name="addr"
                        label="Address"
                        componentProps={ncp}
                      />
                    </Grid>
                    <Grid item xs>
                      <MuiField
                        look="select"
                        name="cmd"
                        label="Command"
                        componentProps={ncp}
                      >
                        <MenuItem value={1}>Read Coils</MenuItem>
                        <MenuItem value={2}>Read DiscreteInputs</MenuItem>
                        <MenuItem value={3}>Read Holding Registers</MenuItem>
                        <MenuItem value={4}>Read Input Registers</MenuItem>
                        <MenuItem value={5}>Write Coil</MenuItem>
                        <MenuItem value={6}>Write Holding Register</MenuItem>
                        <MenuItem value={7}>Read Exception Status</MenuItem>
                        <MenuItem value={8}>Diagnostic</MenuItem>
                        <MenuItem value={11}>Get Com Event Counter</MenuItem>
                        <MenuItem value={12}>Get Com Event Log</MenuItem>
                        <MenuItem value={15}>Write Multiple Coils</MenuItem>
                        <MenuItem value={15}>
                          Write Multiple Holding Registers
                        </MenuItem>
                      </MuiField>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs>
                      <MuiField
                        name="regs"
                        label="Start reg"
                        componentProps={ncp}
                      />
                    </Grid>
                    <Grid item xs>
                      <MuiField
                        name="regc"
                        label="Reg count"
                        componentProps={ncp}
                      />
                    </Grid>
                    <Grid item xs>
                      <MuiField name="v" label="Value" componentProps={ncp} />
                    </Grid>
                    <Grid item xs>
                      <SubmitButton label="Run request" />
                    </Grid>
                  </Grid>
                  <Alert {...alertProps} />
                </TabPanel>
              </Paper>
            </WidgetBox>
          );
        }}
      </FormikConsumer>
    </MuiForm>
  );
}

export default connect((state: any) => ({
  state: Backend.selectConfig<IOptions>(state, Name),
  resp: state.modbus || {},
}))(Widget);
