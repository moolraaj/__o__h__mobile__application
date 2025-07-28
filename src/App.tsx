import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './store/Store/Store';
import i18n from './i18n';
import { AuthProvider } from './navigation/AuthContext';
import { RootNavigator } from './navigation/RootNavigator';
import { ProfileChecker } from './common/ProfileChecker';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { navigate } from './navigation/NavigationService';
 

export default function App() {
 
  useEffect(() => {
    async function createDefaultChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    }
    createDefaultChannel();
  }, []);

  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.notification) {
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',  
            pressAction: { id: 'default' },
          },
        });
      }
    });
    return unsubscribe;
  }, []);

 
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const id = remoteMessage.data?.id;
      if (id) {
        console.log('🔗 Navigate from background notification:', id);
        navigate('QuestionnaireDetails', { id });
      }
    });
    return unsubscribe;
  }, []);

 
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.id) {
          console.log('🛑 Navigate from quit notification:', remoteMessage.data.id);
          navigate('QuestionnaireDetails', { id: remoteMessage.data.id });
        }
      });
  }, []);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <AuthProvider>
            <ProfileChecker />
            <RootNavigator />
            <Toast position="top" autoHide visibilityTime={3000} topOffset={10} />
          </AuthProvider>
        </Provider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
