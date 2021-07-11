import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import { IState, IMultiProps } from './types';
import Hbridge from './Hbridge';
import * as Backend from '../../backend';
import { WidgetBox, NameValueList, useModuleState } from '../../app';

export default ({ nameOrList, title }: IMultiProps) => {
  const list = [];
  if (typeof nameOrList === 'string')
    list.push(<Hbridge name={nameOrList} title={title} />);
  else
    for (const i of nameOrList)
      list.push(<Hbridge key={i[0]} name={i[0]} title={i[1]} />);

  return <WidgetBox title={title || 'H-Bridges'}>{list}</WidgetBox>;
};
