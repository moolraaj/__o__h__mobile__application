import {
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Layout } from '../common/Layout';
import { useAuth } from '../navigation/AuthContext';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SettingScreen = () => {
  const { setToken, setUser } = useAuth();
  const { t } = useTranslation();
  const [language, setLanguage] = useState('en');

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
    <Layout>
      <ScrollView style={styles.container}>
  
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
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
          <SettingOption icon="person-outline" label="Edit Profile" />
          <SettingOption icon="shield-outline" label="Security" />
          <SettingOption icon="notifications-outline" label="Notifications" />
          <SettingOption icon="lock-closed-outline" label="Change Password" />
        </LinearGradient>

 
        <Text style={styles.sectionTitle}>Language & Accessibility</Text>
        <View style={styles.languageContainer}>
          <Text style={styles.languageLabel}>Language Selection</Text>
          <View style={styles.languageDropdown}>
            <Picker
              selectedValue={language}
              onValueChange={(itemValue) => setLanguage(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Kannada" value="kn" />
            </Picker>
          </View>
        </View>

      
        <Text style={styles.sectionTitle}>Support & Feedback</Text>
        <LinearGradient
          colors={['#F8E4FF', '#FFD7D8']}
          locations={[0.2081, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sectionContainer}
        >
          <SettingOption icon="help-circle-outline" label="Help & Support" />
          <SettingOption icon="document-text-outline" label="Terms And Policies" />
        </LinearGradient>

    
        <Text style={styles.sectionTitle}>Logout</Text>
        <LinearGradient
          colors={['#F8E4FF', '#FFD7D8']}
          locations={[0.2081, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sectionContainer}
        >
          <TouchableOpacity style={styles.sectionBtn} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#56235E" />
            <Text style={styles.btnText}>Log Out</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </Layout>
  );
};

 
const SettingOption: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <TouchableOpacity style={styles.sectionBtn}>
    <Ionicons name={icon} size={22} color="#56235E" />
    <Text style={styles.btnText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#80225E',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#80225E',
    marginVertical: 10,
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
  },
  btnText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  languageContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  languageLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  languageDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default SettingScreen;
