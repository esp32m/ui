import { WidgetBox, NameValueList, formatBytes, useModuleState } from '..';

import {
  Name,
  IHardwareState,
  Models,
  Features,
  ResetReasons,
} from './types';
import { flashMode } from './utils';

function features(features: number) {
  const list = [];
  for (const [key, value] of Object.entries(Features))
    if (features & (key as unknown as number)) list.push(value);
  return list.join(', ');
}

export default ()=>{
  const { flash, heap, chip, spiffs, psram } = useModuleState<IHardwareState>(Name) || {};
  const list = [];
  if (chip) {
    if (chip.revision || chip.freq)
      list.push([
        'Chip type / frequency',
        `${Models[chip.model] || 'unknown'} rev.${chip.revision} (${
          chip.cores
        } cores) @ ${chip.freq} MHz`,
      ]);
    if (chip.temperature)
      list.push(['Chip temperature', Math.round(chip.temperature) + ' \u2103']);
    if (chip.features) list.push(['Chip features', features(chip.features)]);
    if (chip.rr) list.push(['Reset reason', ResetReasons[chip.rr]]);
  }
  if (flash) {
    list.push([
      'Flash size / speed / mode',
      formatBytes((flash.size / 8) * 1024 * 1024) +
        ' / ' +
        flash.speed +
        'MHz / ' +
        flashMode(flash.mode),
    ]);
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
  if (psram && psram.size && psram.free) {
    list.push([
      'PSRAM size / free (% used)',
      formatBytes(psram.size) +
        ' / ' +
        formatBytes(psram.free) +
        ' (' +
        Math.round(((psram.size - psram.free) * 100) / psram.size) +
        '%)',
    ]);
  }
  if (!list.length) return null;

  return (
    <WidgetBox title="Hardware summary">
      <NameValueList list={list} />
    </WidgetBox>
  );
}

