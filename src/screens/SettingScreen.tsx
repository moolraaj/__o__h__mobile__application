import React from 'react';
import {
  Text,
 
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
 

import { Layout } from '../common/Layout';
import { useAuth } from '../navigation/AuthContext';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SettingScreen = ({ navigation }: { navigation: any }) => {
  const {  logout } = useAuth();
  const { t } = useTranslation();


 

  const handleEditProfile = () => {
    navigation.navigate('SettingUpdateUser');
  };

  const handleSecurity = () => {
    navigation.navigate('SettingChangePassword');
  };

  // const handleNotifications = () => {

  // };



  const handleTerms = () => {
    navigation.navigate('TermConditionScreen');
  };

  const handlePolicies = () => {
    navigation.navigate('PrivacypoliciesScreen');
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Feather name='settings' size={20} color="#56235E" />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <LinearGradient
          colors={['#F8E4FF', '#FFD7D8']}
          locations={[0.2081, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sectionContainer}
        >
          <SettingOption
            icon="person-outline"
            label="Edit Profile"
            onPress={handleEditProfile}
          />
          <SettingOption
            icon="shield-outline"
            label="Security"
            onPress={handleSecurity}
          />
          {/* <SettingOption
            icon="notifications-outline"
            label="Notifications"
            onPress={handleNotifications}
          /> */}

        </LinearGradient>

        <Text style={styles.sectionTitle}>Privacy Policies & Term and Conditions</Text>
        <LinearGradient
          colors={['#F8E4FF', '#FFD7D8']}
          locations={[0.2081, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sectionContainer}
        >

          <SettingOption
            icon="document-text-outline"
            label="Privacy Policies"
            onPress={handlePolicies}
          />
          <SettingOption
            icon="document-text-outline"
            label="Term and Conditions"
            onPress={handleTerms}
          />
        </LinearGradient>

        <Text style={styles.sectionTitle}>Logout</Text>
        <LinearGradient
          colors={['#F8E4FF', '#FFD7D8']}
          locations={[0.2081, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sectionContainer}
        >
          <TouchableOpacity style={styles.sectionBtn} onPress={logout}>
            <MaterialIcons name="logout" size={24} color="#56235E" />
            <Text style={styles.btnText}>Log Out</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </Layout>
  );
};

const SettingOption: React.FC<{
  icon: string;
  label: string;
  onPress?: () => void;
}> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.sectionBtn} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#56235E" />
    <Text style={styles.btnText}>{label}</Text>
    <View style={{ flex: 1 }} />
    <Ionicons name="chevron-forward" size={20} color="#56235E" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#80225E',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#80225E',
    marginVertical: 10,
    marginLeft: 8,
  },
  sectionContainer: {
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  sectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 2,
  },
  btnText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
});

export default SettingScreen;