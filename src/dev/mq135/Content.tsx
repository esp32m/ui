import { IProps, IState } from './types';
import { WidgetBox, NameValueList, useModuleState } from '../..';

export default ({ name, title }: IProps) => {
  const state = useModuleState<IState>(name);
  if (!state || !state.length) return null;
  const [age = -1, value] = state;
  if (age < 0 || age > 60 * 1000) return null;
  const list = [];
  if (!isNaN(value)) list.push(['Gas level', `${(value * 100)?.toFixed(1)}%`]);
  return (
    <WidgetBox title={title || name}>
      <NameValueList list={list} />
    </WidgetBox>
  );
};
