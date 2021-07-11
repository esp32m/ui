import React from 'react';
import { connect } from 'react-redux';
import { IProps, IState } from './types';
import * as Backend from '../../backend';
import { WidgetBox, NameValueList, useModuleState } from '../../app';

export default connect((state: any, props: IProps) => ({
  state: Backend.selectState<IState>(state, props.name),
}))(({ state, name, title }: { state: IState } & IProps) => {
  useModuleState(name);
  if (!state || !state.length) return null;
  const [age = -1, value] = state;
  if (age < 0 || age > 60 * 1000) return null;
  const list = [];
  if (!isNaN(value)) list.push(['Rain', `${(value * 100)?.toFixed(1)}%`]);
  return (
    <WidgetBox title={title || name}>
      <NameValueList list={list as any} />
    </WidgetBox>
  );
});
