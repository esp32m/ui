import { useEffect } from 'react';

import * as Backend from '../../backend';
import { WidgetBox } from '../..';

import { Name, ILocalState } from './types';
import { Bluetooth } from '@mui/icons-material';
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useSelector } from 'react-redux';
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

const select = (state: IRootState): ILocalState => state?.[Name];

export default () => {
  useEffect(() => {
    request('scan', { active: true });
    return () => {
      cancelAsync();
    };
  }, []);
  const local = useSelector(select);
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
};
