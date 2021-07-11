import React from 'react';
import { connect } from 'react-redux';

import * as Backend from '../backend';
import { WidgetBox, NameValueList, useModuleState } from '..';

import { Name, IMqttState } from './types';

interface IProps {
  state: IMqttState;
}

export default connect((state: Backend.IRootState) => ({
  state: Backend.selectState<IMqttState>(state, Name),
}))(({ state }: IProps) => {
  useModuleState(Name);
  if (!state) return null;
  const { ready, uri, client, pubcnt, cmdcnt } = state;
  const list = [];
  list.push(['Connection state', ready ? 'connected' : 'not connected']);
  if (uri) list.push(['URL', uri]);
  if (client) list.push(['Client name', client]);
  if (pubcnt) list.push(['Published messages', pubcnt]);
  if (cmdcnt) list.push(['Received messages', cmdcnt]);
  return (
    <WidgetBox title="MQTT client state">
      <NameValueList list={list} />
    </WidgetBox>
  );
});
