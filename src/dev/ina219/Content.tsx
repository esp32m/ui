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
  const { addr: a, current, voltage, shuntVoltage, power } = state;
  if (addr && addr != a) return null;
  const list: Array<any> = [];
  list.push(['Voltage', `${voltage} V`]);
  list.push(['Current', `${current} mA`]);
  list.push(['Power', `${power} W`]);
  list.push(['Shunt voltage', `${shuntVoltage} mV`]);
  if (!list.length) return null;

  return (
    <WidgetBox title={title || 'INA219'}>
      <NameValueList list={list as any} />
    </WidgetBox>
  );
});
