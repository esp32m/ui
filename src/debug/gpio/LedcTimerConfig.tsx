import React, { useMemo, useRef, useState } from 'react';
import { FormikProps } from 'formik';
import * as Yup from 'yup';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  makeStyles,
  Select,
  Switch,
} from '@material-ui/core';

import { Backend, MuiField, MuiForm } from '../..';
import { LedctsConfig, LedctConfig, LedcMode, LedcClkCfg, Name } from './types';
import { LedcModes, LedcTimers, toMenuItem } from './tools';

export interface ILedctConfig {
  mode: LedcMode;
  dutyres: number;
  freq: number;
  clk: LedcClkCfg;
}

const DefaultLedctConfig: ILedctConfig = {
  mode: LedcMode.LowSpeed,
  dutyres: 13,
  freq: 5000,
  clk: LedcClkCfg.Auto,
};
const LedcClks = [
  [LedcClkCfg.Auto, 'Auto'],
  [LedcClkCfg.RefTick, 'REF_TICK'],
  [LedcClkCfg.Apb, 'APB clock'],
  [LedcClkCfg.Rtc8m, 'RTC8M_CLK'],
];

function fromConciseConfig(config: LedctConfig): ILedctConfig {
  const result: ILedctConfig = Object.assign({}, DefaultLedctConfig);
  if (config) {
    [
      result.mode = LedcMode.LowSpeed,
      result.dutyres = 13,
      result.freq = 5000,
      result.clk = LedcClkCfg.Auto,
    ] = config;
  }
  return result;
}

function toConciseConfig(config: ILedctConfig): LedctConfig {
  const c = config || DefaultLedctConfig;
  return [c.mode, c.dutyres, c.freq, c.clk];
}

const useStyles = makeStyles({
  switch: { marginRight: 0, marginLeft: 'auto' },
});

const ValidationSchema = Yup.object().shape({
  dutyres: Yup.number().integer().min(1).max(20),
  freq: Yup.number().integer().min(130).max(55000),
});

const component = (props: {
  config: LedctsConfig;
  open: boolean;
  onClose: () => void;
}) => {
  const { config = [], open, onClose } = props;
  const [timer, setTimer] = useState<number>(0);
  const [enabledMask, setEnabledMask] = useState<number>(
    config.reduce((p, c, i) => (c ? p | (1 << i) : 0), 0) || 0
  );
  const data = useRef<Array<ILedctConfig>>(config.map(fromConciseConfig));
  const classes = useStyles();
  const handleClose = () => {
    onClose();
  };
  const enabled = useMemo(
    () => (enabledMask & (1 << timer)) != 0,
    [enabledMask, timer]
  );
  const handleSubmit = async (values: any) => {
    data.current[timer] = enabled ? Object.assign({}, values) : null;
    const d = {
      ledcts: data.current.map((v, i) =>
        (enabledMask & (1 << i)) == 0 ? null : toConciseConfig(v)
      ),
    };
    await Backend.setConfig(Name, d);
    onClose();
  };
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setEnabledMask(enabledMask | (1 << timer));
    else setEnabledMask(enabledMask & ~(1 << timer));
  };
  const fieldProps = {
    fullWidth: true,
    componentProps: { disabled: !enabled },
  };
  const getValues = () => data.current[timer] || DefaultLedctConfig;
  return (
    <MuiForm
      initial={getValues()}
      enableReinitialize={false}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
    >
      {(controller: FormikProps<any>) => {
        const handleTimerChange = (
          event: React.ChangeEvent<{ value: unknown }>
        ) => {
          if (enabled)
            data.current[timer] = Object.assign({}, controller.values);
          setTimer(Number(event.target.value));
          controller.setValues(getValues());
        };
        return (
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle> LEDC timers settings </DialogTitle>
            <DialogContent style={{ width: 480 }} dividers>
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="lledct">LEDC timer</InputLabel>
                    <Select
                      labelId="lledct"
                      value={timer}
                      onChange={handleTimerChange}
                      fullWidth
                    >
                      {LedcTimers}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    className={classes.switch}
                    control={
                      <Switch checked={enabled} onChange={handleSwitchChange} />
                    }
                    label="Enable this timer"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <MuiField
                    look="select"
                    name="mode"
                    label="LEDC mode"
                    {...fieldProps}
                  >
                    {LedcModes.map(toMenuItem)}
                  </MuiField>
                </Grid>
                <Grid item xs={6}>
                  <MuiField
                    name="dutyres"
                    label="Duty resolution"
                    {...fieldProps}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MuiField name="freq" label="Frequency" {...fieldProps} />
                </Grid>
                <Grid item xs={6}>
                  <MuiField
                    look="select"
                    name="clk"
                    label="Clock source"
                    {...fieldProps}
                  >
                    {LedcClks.map(toMenuItem)}
                  </MuiField>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => controller.handleSubmit()} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        );
      }}
    </MuiForm>
  );
};

export default component;
