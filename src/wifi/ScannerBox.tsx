import React from 'react';
import { connect } from 'react-redux';
import { PermScanWifiTwoTone } from '@material-ui/icons';
import { Avatar } from '@material-ui/core';

import * as Backend from '../backend';
import { WidgetBox } from '../app';

import { select } from './utils';
import { Name, ScanEntries, IWifiState, WifiStatus, IRootState } from './types';
import { UnconnectedScanList } from './ScanList';

interface IProps {
  scan: ScanEntries;
  state: IWifiState;
}

function ScannerBox({ scan, state }: IProps) {
  const { status } = state || {};
  const scanning = !scan || !!(status & WifiStatus.Scanning);
  return (
    <WidgetBox
      progress={scanning}
      title="Available access points"
      avatar={
        <Avatar>
          <PermScanWifiTwoTone />
        </Avatar>
      }
    >
      <UnconnectedScanList {...{ scan, state }} />
    </WidgetBox>
  );
}

export default connect((state: IRootState) => ({
  state: Backend.selectState<IWifiState>(state, Name),
  scan: select(state)?.scan,
}))(ScannerBox);
