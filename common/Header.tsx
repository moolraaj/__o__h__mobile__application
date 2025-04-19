 
import React, { useState, useRef, useEffect } from 'react';
import {
  View, SafeAreaView, StyleSheet, Text, TouchableOpacity,
  Modal, Animated, Easing, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {   useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../navigation/AuthContext';  

export function Header() {
  const { t, i18n } = useTranslation();
  
  const { setToken, setUser } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible]       = useState(false);
  const [userName, setUserName]               = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const languages = [
    { label: 'EN', value: 'en' },
    { label: 'KN', value: 'kn' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const userJson = await AsyncStorage.getItem('user');
        const user     = userJson ? JSON.parse(userJson) : null;
        setUserName(user?.name ?? null);
      })();
    }, []),
  );

  useEffect(() => setSelectedLanguage(i18n.language), [i18n.language]);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };
  const onLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    closeModal();
  };

  const handleLogout = () => {
    Alert.alert(
      t('logoutTitle', 'Logout'),
      t('logoutMsg', 'Are you sure?'),
      [
        { text: t('cancel', 'Cancel') },
        {
          text: t('logout', 'Logout'),
          style: 'destructive',
          onPress: async () => {
          
            await AsyncStorage.multiRemove(['authToken', 'user']);
           
            setToken(null);
            setUser(null);
             
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.logo}>logo</Text>
        {userName && <Text style={styles.greet}>{t('hi', 'Hi')} {userName}</Text>}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.selectBox} onPress={openModal}>
            <Text style={styles.selectText}>{selectedLanguage.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutTxt}>{t('logout', 'Logout')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={modalVisible} onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
            onStartShouldSetResponder={() => true}
          >
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.value}
                style={styles.modalItem}
                onPress={() => onLanguageSelect(lang.value)}
              >
                <View style={styles.radioContainer}>
                  <View style={styles.radioOuter}>
                    {selectedLanguage === lang.value && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.modalItemText}>{lang.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#fff' },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: { fontSize: 18, fontWeight: 'bold' },
  greet: { fontSize: 16, marginRight: 8 },
  selectBox: {
    width: 50,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 6,
  },
  selectText: { fontSize: 16 },
  logoutBtn: { padding: 8 },
  logoutTxt: { color: 'red', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: { fontSize: 16, marginLeft: 12 },
  radioContainer: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#555' },
});

export default Header;
