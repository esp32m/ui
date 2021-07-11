import React from 'react';
import { connect } from 'react-redux';
import { IProps, IState } from './types';
import * as Backend from '../../backend';
import { WidgetBox, NameValueList, useModuleState } from '../../app';

const Defs: { [key: number]: any } = {
  5386: {
    title: 'Wind speed sensor',
    value: 'Speed',
  },
  5387: {
    title: 'Wind direction sensor',
    value: 'Direction',
  },
};

export default connect((state: any, props: IProps) => ({
  state: Backend.selectState<IState>(state, props.name),
}))(({ state, name, title }: { state: IState } & IProps) => {
  useModuleState(name);
  if (!state || !state.length) return null;
  const [age = -1, a, model = 0, value] = state;
  if (age < 0 || age > 60 * 1000) return null;
  const list = [];
  if (model) list.push(['Model', model]);
  const def = Defs[model];
  if (def && !isNaN(value)) {
    list.push([def.value, `${value.toFixed(2)}`]);
  }
  return (
    <WidgetBox title={title || def?.title || name}>
      <NameValueList list={list as any} />
    </WidgetBox>
  );
});
