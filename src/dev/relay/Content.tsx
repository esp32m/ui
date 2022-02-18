import { IMultiProps } from './types';
import Relay from './Relay';
import { WidgetBox } from '../..';

export default ({ nameOrList, title }: IMultiProps) => {
  const list = [];
  if (typeof nameOrList === 'string')
    list.push(<Relay name={nameOrList} title={title} />);
  else
    for (const i of nameOrList)
      if (typeof i === 'string')
        list.push(<Relay key={i} name={i} title={i} />);
      else list.push(<Relay key={i[0]} name={i[0]} title={i[1]} />);

  return <WidgetBox title={title || 'Relays'}>{list}</WidgetBox>;
};
