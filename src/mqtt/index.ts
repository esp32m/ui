import { Plugins } from '../plugins';
import { RssFeed } from '@material-ui/icons';
import Content from './Content';

export { default as MqttStateBox } from './State';

export const useMqtt = (): void => {
  Plugins.register({
    name: 'mqtt',
    content: { title: 'MQTT client', icon: RssFeed, component: Content },
  });
};
