
import {
  WidgetBox,
  NameValueList,
  formatBytes,
  useModuleState,
  millisToStr,
} from '..';

import { Name, IHardwareState, IAppState, ResetReasons } from './types';

export default ()=> {
  const hw=useModuleState<IHardwareState>(Name);
  const app=useModuleState<IAppState>('app');
  const list = [];
  if (app) {
    const { time, uptime } = app || {};
    if (uptime) list.push(['Uptime', millisToStr(uptime)]);
    if (time) list.push(['Chip time', new Date(time * 1000).toUTCString()]);
  }
  if (hw) {
    const { heap, chip, spiffs } = hw || {};
    if (chip) {
      if (chip.revision || chip.freq)
        list.push(['Chip frequency', `${chip.freq} MHz`]);
      if (chip.temperature)
        list.push([
          'Chip temperature',
          Math.round(chip.temperature) + ' \u2103',
        ]);
      if (chip.rr) list.push(['Reset reason', ResetReasons[chip.rr]]);
    }
    if (heap && heap.size && heap.free) {
      list.push([
        'RAM size / free (% fragmented)',
        formatBytes(heap.size) +
          ' / ' +
          formatBytes(heap.free) +
          ' (' +
          Math.round(((heap.free - heap.max) * 100) / heap.free) +
          '%)',
      ]);
    }
    if (spiffs && spiffs.size && spiffs.free) {
      list.push([
        'SPIFFS size / free (% used)',
        formatBytes(spiffs.size) +
          ' / ' +
          formatBytes(spiffs.free) +
          ' (' +
          Math.round(((spiffs.size - spiffs.free) * 100) / spiffs.size) +
          '%)',
      ]);
    }
  }
  if (!list.length) return null;

  return (
    <WidgetBox title="System health">
      <NameValueList list={list} />
    </WidgetBox>
  );
}
