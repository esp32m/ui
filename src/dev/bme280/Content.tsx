import { Name, IState, IProps } from './types';
import { WidgetBox, NameValueList, useModuleState } from '../..';

export default ({ title, addr }: IProps) => {
  const state = useModuleState<IState>(Name);
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
};
