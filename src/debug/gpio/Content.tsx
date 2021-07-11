import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  makeStyles,
  ButtonProps,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import * as Backend from '../../backend';
import { WidgetBox, useModuleState, useConfig } from '../../app';

import { IGpioState, Name, IGpioConfig, PinConfig, PinMode } from './types';
import PinConfigForm from './PinConfig';
import LedcTimerConfigForm from './LedcTimerConfig';

interface IProps {
  state: IGpioState;
  config: IGpioConfig;
}

interface IPinProps {
  pin: number;
  config: PinConfig;
  state: string;
  onClick: (pin: number, target: HTMLElement) => void;
}

const useStyles = makeStyles({
  pinButton: { minWidth: 45, paddingLeft: 6, paddingRight: 6, margin: 3 },
  filler: { flexGrow: 1 },
  bottomContainer: { justifyContent: 'space-between' },
  icon: { padding: 8 },
});

interface IPinLayout {
  left: Array<number>;
  right: Array<number>;
  bottom: Array<number>;
}

const PinGnd = -1;
const Pin3v3 = -2;
const PinEn = -3;
const PinNA = -4;
const PinLabels = [undefined, 'GND', '3V3', 'EN', 'N/A'];

const PinLayouts: Array<IPinLayout> = [
  {
    left: [PinGnd, Pin3v3, PinEn, 36, 39, 34, 35, 32, 33, 25, 26, 27, 14, 12],
    right: [PinGnd, 23, 22, 1, 3, 21, PinNA, 19, 18, 5, 17, 16, 4, 0],
    bottom: [PinGnd, 13, 9, 10, 11, 6, 7, 8, 15, 2],
  },
];

const PinTypeShort = ['', 'd', 'adc', 'dac', 'cw', 'led', 'sd', 'pc', 'ts'];

const Pin = ({ pin, config, state, onClick }: IPinProps) => {
  let label =
    pin < 0 ? PinLabels[-pin] : `${pin} ${PinTypeShort[config?.[0] || 0]}`;
  if (state != null) label += ` ${state}`;
  const classes = useStyles();
  const bp: ButtonProps = {
    variant: 'contained',
    className: classes.pinButton,
    color: state ? 'secondary' : 'primary',
    disabled: pin < 0,
    onClick: (e) => onClick(pin, e.currentTarget),
  };
  return (
    <Grid item>
      <Button {...bp}>{label}</Button>
    </Grid>
  );
};

const enum ConfigFormType {
  None,
  LedcTimers,
}

interface IRootState extends Backend.IRootState {
  [Name]: IGpioState;
}

const content = connect((state: IRootState) => ({
  state: Backend.selectState<IGpioState>(state, Name),
  config: Backend.selectConfig<IGpioConfig>(state, Name),
}))(({ state, config }: IProps) => {
  useModuleState(Name);
  useConfig(Name);
  const classes = useStyles();
  const [configPin, setConfigPin] = useState<number>(-1);
  const [clickedPin, setClickedPin] = useState<number>(-1);
  const [configForm, setConfigForm] = useState<ConfigFormType>(
    ConfigFormType.None
  );
  const [configAnchor, setConfigAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const [pinAnchor, setPinAnchor] = React.useState<null | HTMLElement>(null);
  const { pins: ps } = state || {};
  if (!ps) return null;
  const { pins: pc } = config || {};
  if (!pc) return null;
  const handleConfigClose = () => {
    setConfigPin(-1);
  };
  const handlePinClick = (pin: number, anchor: HTMLElement) => {
    const [mode] = pc[pin] || [];
    setClickedPin(pin);
    switch (mode) {
      case PinMode.Digital:
        setPinAnchor(anchor);
        break;
      default:
        setConfigPin(pin);
        break;
    }
  };
  const handleConfigure = (e: React.MouseEvent<HTMLElement>) =>
    setConfigAnchor(e.currentTarget);
  const handleConfigMenuClose = () => setConfigAnchor(null);
  const handleConfigFormClose = () => setConfigForm(ConfigFormType.None);
  const handlePinMenuClose = () => setPinAnchor(null);
  const pl = PinLayouts[0];
  const sidePins = [];
  const bottomPins = [];
  const basePinProps = { onClick: handlePinClick };
  for (let i = 0; i < pl.left.length; i++) {
    const lp = pl.left[i];
    const rp = pl.right[i];
    sidePins.push(
      <Grid key={i} container>
        <Grid item>
          <Pin pin={lp} config={pc[lp]} state={ps[lp]} {...basePinProps} />
        </Grid>
        <Grid className={classes.filler} item />
        <Grid item>
          <Pin pin={rp} config={pc[rp]} state={ps[rp]} {...basePinProps} />
        </Grid>
      </Grid>
    );
  }
  const pinMenuItems: Array<JSX.Element> = [];
  if (clickedPin >= 0) {
    const [mode] = pc[clickedPin] || [];
    switch (mode) {
      case PinMode.Digital:
        pinMenuItems.push(
          <MenuItem
            key="toggle"
            onClick={() => {
              Backend.setState(Name, {
                pins: { [clickedPin]: !ps[clickedPin] },
              }),
                setPinAnchor(null);
            }}
          >
            <ListItemText primary="Toggle" />
          </MenuItem>
        );
        break;
    }
  }
  for (const i of pl.bottom)
    bottomPins.push(
      <Grid key={i} item>
        <Pin pin={i} config={pc[i]} state={ps[i]} {...basePinProps} />
      </Grid>
    );
  return (
    <WidgetBox
      title="GPIO pins"
      action={
        <Tooltip title="configure">
          <IconButton
            className={classes.icon}
            aria-label="configure"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleConfigure}
          >
            <Settings />
          </IconButton>
        </Tooltip>
      }
    >
      <Menu
        open={!!configAnchor}
        onClose={handleConfigMenuClose}
        anchorEl={configAnchor}
        keepMounted
      >
        <MenuItem
          onClick={() => {
            setConfigForm(ConfigFormType.LedcTimers);
            setConfigAnchor(null);
          }}
        >
          <ListItemText primary="LEDC timers" />
        </MenuItem>
      </Menu>
      <Menu
        open={!!pinAnchor}
        onClose={handlePinMenuClose}
        anchorEl={pinAnchor}
        keepMounted
      >
        {pinMenuItems}
        <MenuItem
          onClick={() => {
            setPinAnchor(null);
            setConfigPin(clickedPin);
          }}
        >
          <ListItemText primary="Configure" />
        </MenuItem>
      </Menu>
      {sidePins}
      <Grid container className={classes.bottomContainer}>
        {bottomPins}
      </Grid>
      <PinConfigForm
        pin={configPin}
        config={pc[configPin]}
        onClose={handleConfigClose}
      />
      {
        <LedcTimerConfigForm
          open={configForm == ConfigFormType.LedcTimers}
          config={config.ledcts}
          onClose={handleConfigFormClose}
        />
      }
    </WidgetBox>
  );
});

export default content;
