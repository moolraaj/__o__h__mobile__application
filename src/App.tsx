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
import { Alert } from 'react-native';



export default function App({navigation}:{navigation:any}) {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title ?? 'Notification',
        remoteMessage.notification?.body ?? ''
      );
      console.log('🔔 Foreground:', remoteMessage);
    });

    return unsubscribe;
  }, []);



  // App open from background
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const id = remoteMessage.data?.id;
      if (id) {
        console.log("🔗 Navigate to Questionnaire ID:", id);
        navigation.navigate('QuestionnaireDetails', { id });
      }
    });

    return unsubscribe;
  }, []);

  // App opened from quit state
  useEffect(() => {
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        const id = remoteMessage.data?.id;
        console.log("🛑 App launched from notification:", id);
        navigation.navigate('QuestionnaireDetails', { id });
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
