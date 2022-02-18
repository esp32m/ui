import { IProps, IState } from './types';
import { WidgetBox, NameValueList, useModuleState } from '../..';

export default ({ name, title }: IProps) => {
  const state = useModuleState<IState>(name);
  if (!state || !state.length) return null;
  const [age = -1, value, cons] = state;
  if (age < 0 || age > 60 * 1000) return null;
  const list = [];
  if (!isNaN(value)) list.push(['Current flow', `${value?.toFixed(2)}l/min`]);
  if (!isNaN(cons)) list.push(['Consumption', `${cons?.toFixed(2)}l`]);
  return (
    <WidgetBox title={title || name}>
      <NameValueList list={list as any} />
    </WidgetBox>
  );
};
