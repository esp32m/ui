import { registerPlugin } from '../plugins';
import { RssFeed } from '@mui/icons-material';
import Content from './Content';

export { default as MqttStateBox } from './State';

export const useMqtt = (): void => {
  registerPlugin({
    name: 'mqtt',
    content: { title: 'MQTT client', icon: RssFeed, component: Content },
  });
};
