import { Settings } from '@mui/icons-material';
import { Grid, IconButton, MenuItem } from '@mui/material';
import { Backend, useModuleConfig } from '..';
import { useModuleState } from '../app';
import { NameValueList, WidgetBox } from '../components';
import { DialogForm, FieldSelect, FieldText, useDialogForm, useYup } from '../forms';
import { netmask2cidr } from '../utils';
import {
  Config,
  IInterfaceConfig,
  IInterfaceState,
  InterfaceRole,
  Name,
  State,
} from './types';

const DhcpStatusNames = ['initial', 'started', 'stopped'];

const InterfaceRoles = [
  [InterfaceRole.Default, 'Default'],
  [InterfaceRole.Static, 'Static IP'],
  [InterfaceRole.DhcpClient, 'DHCP client'],
  [InterfaceRole.DhcpServer, 'DHCP server'],
];

const toMenuItem = (e: Array<any>, i: number) => (
  <MenuItem key={i} value={e[0]}>
    {e[1]}
  </MenuItem>
);

const Ipv4Fields = ({ prefix }: { prefix: string }) => {
  return (
    <Grid item container spacing={3}>
      <Grid item xs>
        <FieldText name={`${prefix}.0`} label="IP address" />
      </Grid>
      <Grid item xs>
        <FieldText name={`${prefix}.2`} label="Netmask" />
      </Grid>
      <Grid item xs>
        <FieldText name={`${prefix}.1`} label="Gateway" />
      </Grid>
    </Grid>
  );
};

const DnsFields = ({ prefix }: { prefix: string }) => {
  return (
    <Grid item container spacing={3}>
      <Grid item xs>
        <FieldText name={`${prefix}.0`} label="Primary DNS" />
      </Grid>
      <Grid item xs>
        <FieldText name={`${prefix}.1`} label="Secondary DNS" />
      </Grid>
      <Grid item xs>
        <FieldText name={`${prefix}.2`} label="Fallback DNS" />
      </Grid>
    </Grid>
  );
};

const validationSchema = useYup((y)=>y.object().shape({
  mac: y.string().macaddr().nullable(),
  ip: y.array(y.string().ipv4().nullable()),
  dns: y.array(y.string().ipv4().nullable()),
}));

const Interface = ({
  name,
  state,
  config,
  refreshConfig,
}: {
  name: string;
  state: IInterfaceState;
  config: IInterfaceConfig;
  refreshConfig: () => void;
}) => {
  const [hook, openSettings] = useDialogForm({
    initialValues: config,
    onSubmit: async (values) => {
      console.log(values)
      await Backend.setConfig(Name, { [name]: values });
    },
    validationSchema,
  });

  if (!state) return null;
  const { up, desc, hostname, mac, ip, ipv6, dns, dhcpc, dhcps, prio } = state;
  const list = [];
  if (hostname) list.push(['Hostname', hostname]);
  if (mac) list.push(['MAC address', mac]);
  if (ip[0] && ip[2])
    list.push(['IP address', `${ip[0]} / ${netmask2cidr(ip[2])}`]);
  if (ip[1]) list.push(['IP gateway', ip[1]]);
  if (ipv6?.length)
    for (const i in ipv6) list.push(['IPv6 address #' + i, ipv6[i]]);
  if (dns?.length)
    list.push(['DNS servers', dns.filter((a) => !!a).join(', ')]);
  if (dhcpc != undefined || dhcps != undefined) {
    let dhcp = '';
    if (dhcpc != undefined) dhcp += `client (${DhcpStatusNames[dhcpc]})`;
    if (dhcps != undefined) {
      if (dhcp) dhcp += ' / ';
      dhcp += `server (${DhcpStatusNames[dhcps]})`;
    }
    list.push(['DHCP', dhcp]);
  }
  if (prio != undefined) list.push(['Priority', prio]);
  let title = name;
  if (desc) title += ` (${desc})`;
  if (up != undefined) title += ` - ${up ? 'up' : 'down'}`;
  return (
    <WidgetBox
      title={title}
      action={
        <IconButton
          onClick={() => {
            refreshConfig();
            openSettings();
          }}
        >
          <Settings />
        </IconButton>
      }
    >
      <NameValueList list={list} />
      <DialogForm title={`Configure interface ${name}`} hook={hook}>
        <Grid container spacing={3}>
          <Grid item xs>
            <FieldSelect name="role" label="Interface role" fullWidth>
              {InterfaceRoles.map(toMenuItem)}
            </FieldSelect>
          </Grid>
          <Grid item xs>
            <FieldText name="mac" label="MAC address" fullWidth />
          </Grid>
          <Ipv4Fields prefix="ip" />
          <DnsFields prefix="dns" />
        </Grid>
      </DialogForm>
    </WidgetBox>
  );
};

export const Interfaces = () => {
  const state = useModuleState<State>(Name);
  const [config, refresh] = useModuleConfig<Config>(Name);
  if (!state) return null;
  return (
    <>
      {Object.keys(state).map((key) => (
        <Interface
          name={key}
          state={state[key]}
          config={config?.[key]}
          refreshConfig={refresh}
          key={key}
        />
      ))}
    </>
  );
};
