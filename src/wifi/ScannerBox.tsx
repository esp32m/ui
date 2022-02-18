import { useSelector } from 'react-redux';
import { PermScanWifiTwoTone } from '@mui/icons-material';
import { Avatar } from '@mui/material';

import { useModuleState, WidgetBox } from '..';

import { select } from './utils';
import { Name, ScanEntries, IWifiState, WifiStatus, IRootState } from './types';
import ScanList from './ScanList';

export default () => {
  const state = useModuleState<IWifiState>(Name);
  const scan = useSelector<IRootState, ScanEntries>(
    (state) => select(state)?.scan
  );
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
      <ScanList />
    </WidgetBox>
  );
};
