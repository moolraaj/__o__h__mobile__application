
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
  Modal, Animated, Easing, Image, Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import appLogo from '../images/app-icon.jpeg';
import GradientText from './GradientText';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../constants/RootStackParamList';
import { useAuth } from '../navigation/AuthContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetAllNotificationsQuery } from '../store/services/notifications/notificationsApi';

export function Header() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const { user, setToken, setUser, logout } = useAuth();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const languages = [
    { label: 'English', value: 'en', icon: 'globe-americas' },
    { label: 'ಕನ್ನಡ', value: 'kn', icon: 'globe-asia' },
  ];

  const { data: notifications = [] } = useGetAllNotificationsQuery({
    user_id: user?.id,
    page: 1,
    limit: 50,
  });

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

  const openRoleModal = () => {
    setRoleModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeRoleModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setRoleModalVisible(false));
  };

  const onLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    closeModal();
  };

  const getUserInitials = (name: string | null) => {
    if (name) {
      const names = name.trim().split(' ').filter(Boolean);
      const initials = names.slice(0, 2).map(n => n.charAt(0).toUpperCase()).join('');
      return initials;
    }
    return '';
  };

  const handleProfileClick = () => {
    if (user?.role === 'user') return;
    openRoleModal();
  };

  const getRoleBasedLinks = () => {
    // const commonLinks = [
    //   { label: 'Myths & Facts', screen: 'MythsAndFacts', icon: 'book-open' },
    // ];
    if (user?.role === 'dantasurakshaks') {
      return [
        // { label: 'Lesions', screen: 'AllLesions', icon: 'file-medical' },
        { label: 'Questionnaires Feedback Received', screen: 'FeedbackReceivedToDanta', icon: 'comment-medical' },
        { label: 'Questionnaires', screen: 'AllQuestionnaire', icon: 'question-circle' },
        // ...commonLinks,
      ];
    } else if (user?.role === 'admin') {
      return [
        // { label: 'Lesions Received', screen: 'AdminLesions', icon: 'file-medical' },
        { label: 'Questionnaires Received', screen: 'AdminQuestion', icon: 'question-circle' },
        // { label: 'User Management', screen: 'UserManagement', icon: 'users-cog' },
        // ...commonLinks,
      ];
    }
    return [];
  };

  const roleLinks = getRoleBasedLinks();

  const upcommingNotifications = notifications?.data?.filter(n => !n.read).length || null



  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {
          if (user?.role === 'admin') {
            navigation.navigate('Admin' as keyof RootStackParamList);
          } else if (user?.role === 'dantasurakshaks') {
            navigation.navigate('Dashboard' as keyof RootStackParamList);
          } else {
            navigation.navigate('User' as keyof RootStackParamList);
          }
        }}>
          <View style={styles.logoContainer}>
            <Image source={appLogo} style={styles.logo} />
            <GradientText text="E-DantaSuraksha" size={18} />
          </View>
        </TouchableOpacity>

        <View style={styles.rightContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification' as keyof RootStackParamList)}
            style={styles.notificationButton}
          >
            {upcommingNotifications && <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {notifications?.data?.filter(n => !n.read).length || null}
              </Text>
            </View>}

            <FontAwesome name="bell" size={20} color="#6C63FF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.languageButton}
            onPress={openModal}
            activeOpacity={0.7}
          >
            <Ionicons name="language" size={18} color="#6C63FF" />
            <Text style={styles.languageText}>{selectedLanguage.toUpperCase()}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleProfileClick} activeOpacity={0.7}>
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

      {/* Language Selection Modal */}
      <Modal transparent visible={modalVisible} onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                style={[
                  styles.modalItem,
                  selectedLanguage === lang.value && styles.selectedItem
                ]}
                onPress={() => onLanguageSelect(lang.value)}
              >
                <FontAwesome5 name={lang.icon} size={18} color="#6C63FF" />
                <Text style={styles.modalItemText}>{lang.label}</Text>
                {selectedLanguage === lang.value && (
                  <Ionicons name="checkmark" size={20} color="#6C63FF" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Role-based Menu Modal */}
      <Modal transparent visible={roleModalVisible} onRequestClose={closeRoleModal}>
        <Animated.View style={[styles.roleModalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.roleModalBackdrop}
            activeOpacity={1}
            onPress={closeRoleModal}
          />

          <Animated.View
            style={[
              styles.roleModalContent,
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.profileHeader}>
              <LinearGradient
                colors={['#56235E', '#C1392D']}
                locations={[0.2081, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalProfileCircle}
              >
                <Text style={styles.modalProfileText}>{getUserInitials(userName)}</Text>
              </LinearGradient>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
                  {userName}
                </Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.profileRole}>
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.menuDivider} />

            <View style={styles.menuItems}>
              {roleLinks.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.roleModalItem}
                  onPress={() => {
                    navigation.navigate(item.screen as keyof RootStackParamList);
                    closeRoleModal();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <FontAwesome5 name={item.icon} size={16} color="#5E35B1" />
                  </View>
                  <Text style={styles.roleModalText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={logout}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#56235E', '#C1392D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signOutGradient}
              >
                <FontAwesome5 name="sign-out-alt" size={16} color="#FFF" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </LinearGradient>
            </TouchableOpacity>

          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF6584',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    overflow: 'hidden',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    marginLeft: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  selectedItem: {
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
  },
  modalItemText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  roleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  roleModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  roleModalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 16,
    maxHeight: '70%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 12,
  },
  modalProfileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  modalProfileText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  profileRole: {
    fontSize: 13,
    color: '#5E35B1',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 16,
  },
  menuItems: {
    paddingVertical: 8,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 20,
  },
  roleModalText: {
    fontSize: 16,
    color: '#424242',
    flex: 1,
  },
  signOutButton: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF5E62',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  signOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default Header;