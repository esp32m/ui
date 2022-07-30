import { RssFeed } from '@mui/icons-material';
import { IContentPlugin } from '../../app/types';
import { Network } from '../shared';
import Content from './Content';

export { default as MqttStateBox } from './State';

export const Mqtt: IContentPlugin = {
  name: 'mqtt',
  use: Network,
  content: {
    title: 'MQTT client',
    icon: RssFeed,
    component: Content,
    menu: { parent: Network.name },
  },
};
