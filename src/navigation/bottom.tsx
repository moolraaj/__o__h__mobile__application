
import React from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ICON_SIZE } from 'src/constants/Variables';
import { RootStackParamList } from '../constants/RootStackParamList';

export default function BottomBar({
  homeScreen = 'Dashboard',
  settingsScreen = 'Setting',
  barHeight = 60,
}) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const canGoBack = navigation.canGoBack();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.bar, { height: barHeight }]}>
        {canGoBack && (
          <TouchableOpacity onPress={navigation.goBack} style={styles.button}>
            <Ionicons name="chevron-back" size={ICON_SIZE} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate(homeScreen as keyof RootStackParamList)}
          style={styles.button}
        >
          <Ionicons name="home" size={ICON_SIZE} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(settingsScreen as keyof RootStackParamList)}
          style={styles.button}
        >
          <Ionicons name="settings" size={ICON_SIZE} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#fff' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  button: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});
