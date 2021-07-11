import React from 'react';
import { connect } from 'react-redux';

import * as Backend from '../backend';
import {
  WidgetBox,
  NameValueList,
  formatBytes,
  useModuleState,
  millisToStr,
  buildInfo,
} from '../app';

import { IAppState } from './types';

const Name = 'app';

interface IProps {
  state: IAppState;
}

function sdkver(version: string | number) {
  if (typeof version !== 'number') return version;
  return `${(version >> 16) & 0xff}.${(version >> 8) & 0xff}.${version & 0xff}`;
}

function Summary({ state }: IProps) {
  useModuleState(Name);
  const { name, time, uptime, built, version, sdk, size } = state || {};
  const list = [];
  if (name) list.push(['Application name', name]);
  if (time) list.push(['Chip time', new Date(time * 1000).toUTCString()]);
  if (uptime) list.push(['Uptime', millisToStr(uptime)]);
  if (version || built)
    list.push(['Firmware version / build time', `${version} / ${built}`]);
  if (buildInfo)
    list.push([
      'UI version / build time',
      `${buildInfo.version} / ${buildInfo.built}`,
    ]);
  if (sdk) list.push(['SDK version', sdkver(sdk)]);
  if (size) list.push(['Firmware size', formatBytes(size)]);
  if (!list.length) return null;

  return (
    <WidgetBox title="Application summary">
      <NameValueList list={list} />
    </WidgetBox>
  );
}

export default connect((state: Backend.IRootState) => ({
  state: Backend.selectState<IAppState>(state, Name),
}))(Summary);
