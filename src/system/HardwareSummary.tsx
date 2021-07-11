import React from 'react';
import { connect } from 'react-redux';

import * as Backend from '../backend';
import { WidgetBox, NameValueList, formatBytes, useModuleState } from '../app';

import {
  Name,
  IHardwareState,
  ChipModel,
  ChipFeatures,
  Models,
  Features,
  ResetReasons,
} from './types';
import { flashMode } from './utils';

interface IProps {
  state: IHardwareState;
}

function features(features: number) {
  const list = [];
  for (let [key, value] of Object.entries(Features))
    if (features & (key as unknown as number)) list.push(value);
  return list.join(', ');
}

function Summary({ state }: IProps) {
  useModuleState(Name);
  const { flash, heap, chip, spiffs, psram } = state || {};
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

export default connect((state: Backend.IRootState) => ({
  state: Backend.selectState<IHardwareState>(state, Name),
}))(Summary);
