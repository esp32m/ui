import React from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormikContext, FormikConsumer } from 'formik';
import { Button, Grid, Typography, Divider } from '@mui/material';

import {
  FieldText,
  MuiForm,
  validators,
  WidgetBox,
  Backend,
  useModuleState,
} from '../..';

import { Name } from './types';
import { styled } from '@mui/material/styles';

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

const Results = styled('div')({
  marginTop: 16,
  padding: 16,
  paddingTop: 8,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.12)',
});

const ResultMsg = styled(Typography)({
  textAlign: 'center',
  width: '100%',
});
const IdsBox = styled(Grid)({
  marginTop: 10,
});
const ScanDiv = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
});
const StyledScanButton = styled(Button)({
  position: 'absolute',
  bottom: 0,
  right: 0,
});
const IdButton = styled(Button)({
  textTransform: 'none',
});

const ScanButton = () => {
  const { isSubmitting, submitForm } = useFormikContext();
  return (
    <ScanDiv>
      <StyledScanButton
        variant="contained"
        disabled={isSubmitting}
        onClick={submitForm}
      >
        Scan I2C bus
      </StyledScanButton>
    </ScanDiv>
  );
};

const ScanResults = ({
  state,
  scan,
}: {
  state: IOptions;
  scan: IScanResponse;
}) => {
  const { from = 0, to = 127 } = state;
  const { ids = [] } = scan;
  const buttons = [];
  for (let i = from; i <= to; i++)
    if (ids[i >> 3] & (1 << (i & 7)))
      buttons.push(
        <Grid item xs={2} key={i}>
          <IdButton variant="contained" color="secondary">
            0x{i.toString(16)}
          </IdButton>
        </Grid>
      );
  const content = buttons.length ? (
    <IdsBox container spacing={3} wrap="wrap">
      {buttons}
    </IdsBox>
  ) : (
    <ResultMsg variant={'subtitle1'}>{'No devices were detected!'}</ResultMsg>
  );
  return (
    <Results>
      <Typography variant="subtitle1">Scan results</Typography>
      <Divider />
      {content}
    </Results>
  );
};

const ValidationSchema = Yup.object().shape({
  sda: validators.pin,
  scl: validators.pin,
  from: validators.i2cId,
  to: validators.i2cId,
});

export default () => {
  const handleSubmit = async (values: any) => {
    await i2cScan(values);
  };
  const state = useModuleState<IOptions>(Name, { once: true }) || {};
  const scan = useSelector<any, IScanResponse>(
    (state) => state.i2c?.scan || {}
  );
  React.useEffect(() => {
    Backend.requestState(Name);
  }, []);
  const ncp = {
    type: 'number',
    placeholder: 'auto',
    InputLabelProps: { shrink: true },
  };
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
                <FieldText name="sda" label="SDA pin" {...ncp} />
              </Grid>
              <Grid item xs>
                <FieldText name="scl" label="SCL pin" {...ncp} />
              </Grid>
              <Grid item xs>
                <FieldText name="freq" label="Frequency, Hz" {...ncp} />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs>
                <FieldText name="from" label="From ID" {...ncp} />
              </Grid>
              <Grid item xs>
                <FieldText name="to" label="To ID" {...ncp} />
              </Grid>
              <Grid item xs>
                <ScanButton />
              </Grid>
            </Grid>
            {haveResults && <ScanResults state={state} scan={scan} />}
          </WidgetBox>
        )}
      </FormikConsumer>
    </MuiForm>
  );
};
