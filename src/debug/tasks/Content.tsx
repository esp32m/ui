import React from 'react';
import { connect } from 'react-redux';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { Divider, makeStyles } from '@material-ui/core';

import { Plugins } from '../../plugins';
import * as Backend from '../../backend';
import { WidgetBox, useModuleState } from '../../app';

import { ITasksState, Name } from './types';

interface IProps {
  state: ITasksState;
}

interface IRootState extends Backend.IRootState {
  [Name]: ITasksState;
}

const useStyles = makeStyles({
  colNumber: {
    display: 'inline-block',
    width: '3em',
    height: '100%',
    textAlign: 'right',
    paddingRight: 10,
  },
  colName: {
    height: '100%',
    paddingRight: 5,
    paddingLeft: 5,
    display: 'inline-block',
    width: '18em',
  },
  colTime: {
    height: '100%',
    paddingRight: 5,
    paddingLeft: 5,
    display: 'inline-block',
    width: '6em',
  },
  colStack: {
    height: '100%',
    paddingRight: 5,
    paddingLeft: 5,
    display: 'inline-block',
    width: '6em',
  },
});

const Row = ({ data, index, style }: ListChildComponentProps) => {
  const item = index < 0 ? ['Id', 'Name', 'CPU', 'Stack'] : data[index];
  const classes = useStyles();
  return (
    <div style={style}>
      <span className={classes.colNumber}>{item[0]}</span>
      <span className={classes.colName}>{item[1]}</span>
      <span className={classes.colTime}>
        {index < 0 ? item[2] : `${Math.round(item[2] * 100)}%`}
      </span>
      <span className={classes.colStack}>{item[3]}</span>
    </div>
  );
};

const Tasks = connect((state: IRootState) => ({
  state: Backend.selectState<ITasksState>(state, Name),
}))(({ state }: IProps) => {
  useModuleState(Name);
  const { rt, tasks } = state || {};
  if (!tasks) return null;
  const data: Array<[number, string, number, number]> = tasks.map((i) => [
    i[0],
    i[1],
    i[5] / (rt || 1),
    i[6],
  ]);
  data.sort((a, b) => b[2] - a[2]);
  const gp = {
    itemSize: 30,
    itemCount: data.length,
    itemData: data,
    width: '100%',
    height: 300,
  };
  return (
    <WidgetBox title="Tasks">
      <Row data={null} index={-1} style={{ fontWeight: 'bold' }} />
      <Divider style={{ marginBottom: 7 }} />
      <List {...gp}>{Row}</List>
    </WidgetBox>
  );
});

export default Tasks;
