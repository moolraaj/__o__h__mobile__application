/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import App from './src/App';


messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('BG message:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
