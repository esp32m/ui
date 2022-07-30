import { WidgetBox, NameValueList, useModuleState } from '../..';

import { Name, IMqttState } from './types';


export default () => {
  const state=useModuleState<IMqttState>(Name);
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
};
