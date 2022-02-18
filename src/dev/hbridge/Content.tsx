import { IMultiProps } from './types';
import Hbridge from './Hbridge';
import { WidgetBox } from '../..';

export default ({ nameOrList, title }: IMultiProps) => {
  const list = [];
  if (typeof nameOrList === 'string')
    list.push(<Hbridge name={nameOrList} title={title} />);
  else
    for (const i of nameOrList)
      list.push(<Hbridge key={i[0]} name={i[0]} title={i[1]} />);

  return <WidgetBox title={title || 'H-Bridges'}>{list}</WidgetBox>;
};
