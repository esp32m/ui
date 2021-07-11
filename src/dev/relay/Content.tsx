import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import { IState, IMultiProps } from './types';
import Relay from './Relay';
import * as Backend from '../../backend';
import { WidgetBox, NameValueList, useModuleState } from '../../app';

export default ({ nameOrList, title }: IMultiProps) => {
  const list = [];
  if (typeof nameOrList === 'string')
    list.push(<Relay name={nameOrList} title={title} />);
  else
    for (const i of nameOrList)
      list.push(<Relay key={i[0]} name={i[0]} title={i[1]} />);

  return <WidgetBox title={title || 'Relays'}>{list}</WidgetBox>;
};
