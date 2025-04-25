import React, { useState, useRef, useEffect } from 'react';
import {
  View, SafeAreaView, StyleSheet, Text, TouchableOpacity,
  Modal, Animated, Easing, Alert, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../navigation/AuthContext';
import appLogo from '../images/danta-logo.png';
import GradientText from './GradientText';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export function Header({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const { setToken, setUser } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const languages = [
    { label: 'EN', value: 'en' },
    { label: 'KN', value: 'kn' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const userJson = await AsyncStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;
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

  const toggleProfileMenu = () => {
    setProfileMenuVisible(!profileMenuVisible);
  };

  const getUserInitials = (name: string | null) => {
    if (name) {
      const names = name.split(' ');
      const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
      return initials;
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Wrap Image and GradientText in a flex container */}
        <View style={styles.logoContainer}>
          <Image source={appLogo} style={styles.logo} />
          <GradientText text="E-DantaSuraksha" size={18} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          {/* notifications */}
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <FontAwesome name="bell-o" size={18} color="#56235E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectBox} onPress={openModal}>
            <GradientText text={selectedLanguage.toUpperCase()} size={16} />
          </TouchableOpacity>

          {/* Profile Circle */}
          <TouchableOpacity
            onPress={toggleProfileMenu}
          >
            <LinearGradient
              colors={['#56235E', '#C1392D']}
              locations={[0.2081, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.profileCircle}
            >
              <Text style={styles.profileText}>{getUserInitials(userName)}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Logout menu */}
          {profileMenuVisible && (
            <View style={styles.profileMenu}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={20} color="#C1392D" />
                <Text style={styles.logoutTxt}>{t('logout', 'Logout')}</Text>
              </TouchableOpacity>
            </View>
          )}
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
            {languages.map((lang) => (
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
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#fff' },
  container: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 20,
    marginRight: 8,
  },
  selectBox: {
    width: 50,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    maxWidth: 150,
    elevation: 10,
    zIndex: 100,
  },
  logoutBtn: { padding: 12, alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 8 },
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
