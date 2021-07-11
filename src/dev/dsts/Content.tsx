import React from 'react';
import { connect } from 'react-redux';
import { Name, States, IProps, IProbe } from './types';
import * as Backend from '../../backend';
import { WidgetBox, NameValueList, useModuleState } from '../../app';

export default connect((state: any) => ({
  state: Backend.selectState<States>(state, Name),
}))(({ state, probes, title }: { state: States } & IProps) => {
  useModuleState(Name);
  if (!state || !state.length) return null;
  const list = [];
  let label;
  for (const entry of state) {
    if (probes) {
      let found: IProbe | undefined = undefined;
      for (const p of probes)
        if (p[0] == entry[0]) {
          found = p;
          label = p[1];
          break;
        }
      if (!found) continue;
    }
    let t: number | string = entry[3];
    if (typeof t == 'number') t = t.toFixed(2) + ' \u2103';
    else t = '?';
    const f = Math.round((entry[4] as number) * 100);
    if (f < 100) t += `(${100 - f}% failures)`;
    list.push([label || entry[0], t]);
  }
  if (!list.length) return null;

  return (
    <WidgetBox
      title={'Dallas temperature sensor' + (list.length > 1 ? 's' : '')}
    >
      <NameValueList list={list} />
    </WidgetBox>
  );
});
