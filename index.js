/**
 * @format
 */
import Janus from './Janus';
import JanusVideoRoomPlugin from './plugins/videoroom/JanusVideoRoomPlugin';
import JanusStreamingPlugin from './plugins/streaming/JanusStreamingPlugin';
import JanusVideoRoomPublisher from './plugins/videoroom/JanusVideoRoomPublisher';

export {Janus, JanusVideoRoomPlugin, JanusStreamingPlugin, JanusVideoRoomPublisher};

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
