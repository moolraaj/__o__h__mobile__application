import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from './Header';
import Footer from './Footer';
import { invalidateAllCompanyApis } from '../store/Store/ApiDispatch';
import { AppDispatch } from '../store/Store/Store';
import { useDispatch } from 'react-redux';

export function Layout({ children }: { children: React.ReactNode }) {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('authToken');
      console.log('JWT from storage →', token);
    })();
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await invalidateAllCompanyApis(dispatch);
    setTimeout(() => {
      setRefreshing(false);
      console.log('✅ Refresh complete');
    }, 800);
  }, [dispatch, refreshing]);

  return (
    <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C1392D"
            colors={['#C1392D']}
          />
        }
      >
        {children}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
});
