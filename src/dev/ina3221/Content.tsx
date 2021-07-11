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
  const { addr: a, channels } = state;
  if (addr && addr != a) return null;
  const list: Array<any> = [];
  channels.forEach((c, i) => {
    if (c && c.length)
      list.push([
        'Channel ' + i,
        `${c[0]?.toFixed(2)} V / ${c[1]?.toFixed(2)} mA`,
      ]);
  });
  if (!list.length) return null;

  return (
    <WidgetBox title={title || 'INA3221'}>
      <NameValueList list={list as any} />
    </WidgetBox>
  );
});
