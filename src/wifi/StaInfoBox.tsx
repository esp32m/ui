import React from 'react';
import { connect } from 'react-redux';

import * as Backend from '../backend';
import { WidgetBox, NameValueList, useModuleState } from '../app';

import { Name, WifiMode, IWifiState } from './types';
import { rssiToStr } from '../utils';

interface IProps {
  state: IWifiState;
}

function StaInfoBox({ state }: IProps) {
  useModuleState(Name);
  const { sta, mode, ch } = state || {};
  if (!sta || ![WifiMode.Sta, WifiMode.ApSta].includes(mode)) return null;
  const list = [];
  let { ssid, ip } = sta;
  const { mac, bssid, mask, gw, rssi } = sta;
  if (bssid) ssid += ` (${bssid})`;
  if (mask) ip += ` / ${mask}`;
  if (mac) list.push(['STA MAC', mac]);
  if (ssid) list.push(['SSID', ssid]);
  if (ch) list.push(['Channel', ch]);
  if (ip) list.push(['IP address', ip]);
  if (gw) list.push(['IP gateway', gw]);
  if (rssi) list.push(['RSSI', rssiToStr(rssi)]);
  return (
    <WidgetBox title="WiFi station">
      <NameValueList list={list} />
    </WidgetBox>
  );
}

export default connect((state: Backend.IRootState) => ({
  state: Backend.selectState<IWifiState>(state, Name),
}))(StaInfoBox);
