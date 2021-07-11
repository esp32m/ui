import React from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { useFormikContext, FormikConsumer } from 'formik';
import {
  Button,
  Grid,
  Typography,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Divider,
} from '@material-ui/core';

import { MuiField, MuiForm, validators, WidgetBox, Backend } from '../..';

import { Name } from './types';

interface IOptions {
  scl?: number;
  sda?: number;
  freq?: number;
  from?: number;
  to?: number;
}

interface IScanResponse {
  ids: Array<number>;
}

const i2cScan = (req?: IOptions) => Backend.request(Name, 'scan', req);

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
  scan: IScanResponse;
}

const ScanButton = withStyles(styles)(
  ({ classes }: WithStyles<typeof styles>) => {
    const { isSubmitting, submitForm } = useFormikContext();
    return (
      <div className={classes.scanDiv}>
        <Button
          variant="contained"
          className={classes.scanButton}
          disabled={isSubmitting}
          onClick={submitForm}
        >
          Scan I2C bus
        </Button>
      </div>
    );
  }
);

const ScanResults = withStyles(styles)(
  ({ state, scan, classes }: IProps & WithStyles<typeof styles>) => {
    const { from = 0, to = 127 } = state;
    const { ids = [] } = scan;
    const buttons = [];
    for (let i = from; i <= to; i++)
      if (ids[i >> 3] & (1 << (i & 7)))
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

const ValidationSchema = Yup.object().shape({
  sda: validators.pin,
  scl: validators.pin,
  from: validators.i2cId,
  to: validators.i2cId,
});

function Widget(props: IProps) {
  const handleSubmit = async (values: any) => {
    await i2cScan(values);
  };
  React.useEffect(() => {
    Backend.requestState(Name);
  }, []);
  const ncp = {
    type: 'number',
    placeholder: 'auto',
    InputLabelProps: { shrink: true },
  };
  const { state = {}, scan } = props;
  const haveResults = !!scan.ids;

  return (
    <MuiForm
      initial={state}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
    >
      <FormikConsumer>
        {(controller) => (
          <WidgetBox title="I2C bus scanner" progress={controller.isSubmitting}>
            <Grid container spacing={3}>
              <Grid item xs>
                <MuiField name="sda" label="SDA pin" componentProps={ncp} />
              </Grid>
              <Grid item xs>
                <MuiField name="scl" label="SCL pin" componentProps={ncp} />
              </Grid>
              <Grid item xs>
                <MuiField
                  name="freq"
                  label="Frequency, Hz"
                  componentProps={ncp}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs>
                <MuiField name="from" label="From ID" componentProps={ncp} />
              </Grid>
              <Grid item xs>
                <MuiField name="to" label="To ID" componentProps={ncp} />
              </Grid>
              <Grid item xs>
                <ScanButton />
              </Grid>
            </Grid>
            {haveResults && <ScanResults {...props} />}
          </WidgetBox>
        )}
      </FormikConsumer>
    </MuiForm>
  );
}

export default connect((state: any) => ({
  state: Backend.selectState<IOptions>(state, Name),
  scan: state.i2c?.scan || {},
}))(Widget);
