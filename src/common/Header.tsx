import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, SafeAreaView, StyleSheet, Text, TouchableOpacity,
  Modal, Animated, Easing, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import appLogo from '../images/danta-logo.png';
import GradientText from './GradientText';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../constants/RootStackParamList';
import { useAuth } from '../navigation/AuthContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export function Header() {
  const { i18n } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const { token, user } = useAuth();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const languages = [
    { label: 'EN', value: 'en' },
    { label: 'KN', value: 'kn' },
  ];

  useFocusEffect(
    useCallback(() => {
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

  const getUserInitials = (name: string | null) => {
    if (name) {
      const names = name.split(' ');
      const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
      return initials;
    }
    return '';
  };

  const handleProfileClick = () => {
    if (user?.role === 'user') return;
    setRoleModalVisible(!roleModalVisible);
  };

  const getRoleBasedLinks = () => {
    if (user?.role === 'dantasurakshaks') {
      return [
        { label: 'Create Lesions', screen: 'CreateLesions', icon: 'plus' },
        { label: 'Feedback Received', screen: 'FeedbackReceived', icon: 'tooth' },
        { label: 'Questionnaire', screen: 'Questionnaire', icon: 'question-circle' },
      ];
    } else if (user?.role === 'admin') {
      return [
        { label: 'Lesions Received', screen: 'LesionsReceived', icon: 'plus' },
        { label: 'Create Lesions Feedback', screen: 'LesionsFeedback', icon: 'tooth' },
        { label: 'Question Received', screen: 'QuestionReceived', icon: 'question-circle' },
      ];
    }
    return [];
  };

  const roleLinks = getRoleBasedLinks();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={appLogo} style={styles.logo} />
          <GradientText text="E-DantaSuraksha" size={18} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification' as keyof RootStackParamList)}>
            <FontAwesome name="bell-o" size={18} color="#56235E" />
          </TouchableOpacity>

          {/* Language Selector */}
          <TouchableOpacity style={styles.selectBox} onPress={openModal}>
            <GradientText text={selectedLanguage.toUpperCase()} size={16} />
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity onPress={handleProfileClick}>
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
        </View>
      </View>

      {/* Language Modal */}
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

      {/* Custom Role Modal */}
      {roleModalVisible && (
        <TouchableOpacity
          style={styles.ProfileModalBox}
          activeOpacity={1}
          onPress={() => setRoleModalVisible(false)}
        >
          {roleLinks.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.customModalItem}
              onPress={() => {
                navigation.navigate(item.screen as keyof RootStackParamList);
                setRoleModalVisible(false);
              }}
            >
              <FontAwesome5 name={item.icon} size={18} color="#7c2d12" />
              <Text style={styles.customModalText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      )}
    </SafeAreaView>
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
    backgroundColor: '#fff',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 6,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#555',
  },

  // Custom role-based modal
  ProfileModalBox: {
    position: 'absolute',
    top: 55,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 99999
  },
  customModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  customModalText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Header;
