import { IProps, IState } from './types';
import { WidgetBox, NameValueList, useModuleState } from '../..';

export default ({ name, title }: IProps) => {
  const state = useModuleState<IState>(name);
  if (!state || !state.length) return null;
  const [age = -1, value] = state;
  if (age < 0 || age > 60 * 1000) return null;
  const list = [];
  if (!isNaN(value)) list.push(['Pressure', `${value?.toFixed(2)} atm`]);
  return (
    <WidgetBox title={title || name}>
      <NameValueList list={list as any} />
    </WidgetBox>
  );
};
