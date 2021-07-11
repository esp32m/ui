import React, { useEffect } from 'react';

import * as Backend from '../../backend';
import { WidgetBox } from '../../app';

import { Name, ILocalState } from './types';
import { Bluetooth } from '@material-ui/icons';
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { connect } from 'react-redux';
import RssiIcon from '../RssiIcon';

interface IRootState extends Backend.IRootState {
  [Name]: ILocalState;
}

const cancelAsync = () => Backend.request(Name, 'cancel');

const request = (name: string, data?: Backend.Data) => {
  Backend.request(Name, name, data).catch(async (e) => {
    if (e == 259) {
      await cancelAsync();
      await Backend.request(Name, name, data);
    }
  });
};

function Box({ local }: { local: ILocalState }) {
  useEffect(() => {
    request('scan', { active: true });
    return () => {
      cancelAsync();
    };
  }, []);
  const { peripherals } = local || {};
  return (
    <WidgetBox
      title="BLE peripherals"
      avatar={
        <Avatar>
          <Bluetooth />
        </Avatar>
      }
    >
      {peripherals && (
        <List>
          {Object.values(peripherals).map((p, i) => {
            const { data, addr, rssi } = p;
            const { name } = data || {};
            return (
              <ListItem key={'row' + i}>
                <ListItemText
                  primary={name || addr}
                  secondary={!name && addr}
                />
                <ListItemIcon>
                  <RssiIcon {...{ rssi }} />
                </ListItemIcon>
              </ListItem>
            );
          })}
        </List>
      )}
    </WidgetBox>
  );
}

const select = (state: IRootState): ILocalState => state?.[Name];

export default connect((state: IRootState) => ({
  // state: Backend.selectState<IState>(state, Name),
  local: select(state),
}))(Box);
