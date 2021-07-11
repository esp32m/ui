import React from 'react';
import { connect } from 'react-redux';
import { Name, IState, IProps } from './types';
import * as Backend from '../../backend';
import { WidgetBox, NameValueList, useModuleState } from '../../app';

export default connect((state: any) => ({
  state: Backend.selectState<IState>(state, Name),
}))(({ state, title, addr }: { state: IState } & IProps) => {
  useModuleState(Name);
  if (!state) return null;
  const { addr: a, temperature, pressure, humidity } = state;
  if (addr && addr != a) return null;
  const list = [];
  if (temperature)
    list.push(['Temperature', temperature.toFixed(2) + ' \u2103']);
  if (pressure)
    list.push([
      'Pressure',
      `${pressure.toFixed(2)} pa / ${(pressure * 0.00750062).toFixed(2)} mmhg`,
    ]);
  if (humidity) list.push(['Humidity', humidity.toFixed(2) + '%']);
  if (!addr && a) list.push(['I2C address', '0x' + a.toString(16)]);
  if (!list.length) return null;

  return (
    <WidgetBox title={title || 'BME280'}>
      <NameValueList list={list as any} />
    </WidgetBox>
  );
});
