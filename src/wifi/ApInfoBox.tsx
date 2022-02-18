import { WidgetBox, NameValueList, useModuleState } from '..';

import { Name, WifiMode, IWifiState } from './types';


export default ()=> {
  const state=useModuleState<IWifiState>(Name);
  const { ap, mode } = state || {};
  if (!ap || ![WifiMode.Ap, WifiMode.ApSta].includes(mode)) return null;
  const list = [];
  if (ap.mac) list.push(['AP MAC', ap.mac]);
  if (ap.ssid) list.push(['SSID', ap.ssid]);
  if (ap.mac) list.push(['MAC', ap.mac]);
  if (state.ch) list.push(['Channel', state.ch]);
  if (ap.ip) list.push(['IP address', ap.ip]);
  if (ap.gw) list.push(['IP gateway', ap.gw]);
  if (ap.cli) list.push(['Clients', ap.cli]);
  return (
    <WidgetBox title="WiFi Access Point">
      <NameValueList list={list} />
    </WidgetBox>
  );
}

