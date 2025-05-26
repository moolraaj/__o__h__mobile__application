import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './store/Store/Store';
import i18n from './i18n';
import { AuthProvider } from './navigation/AuthContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <AuthProvider>
            <RootNavigator />
            <Toast position="top" autoHide visibilityTime={3000} topOffset={10} />
          </AuthProvider>
        </Provider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
