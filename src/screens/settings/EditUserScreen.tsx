import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../navigation/AuthContext';
import { useGetSingleUserQuery, useUpdateUserMutation } from '../../store/services/user/userApi';
import { Layout } from '../../common/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ToastMessage } from '../../resuable/Toast';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GradientText from '../../common/GradientText';

const EditUserScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: userData, isLoading } = useGetSingleUserQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
  });

  let data = userData?.user;

  useEffect(() => {
    if (userData) {
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        role: data.role || '',
      });
    }
  }, [userData]);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateUser({
        userId,
        userData: {
          name: formData.name,
          email: formData.email,
        }
      }).unwrap();

      ToastMessage('success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      ToastMessage('error', 'Failed to update profile');
    }
  };

  return (
    <Layout>
      {isLoading ?
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
        :
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.profileHeader}>
            <LinearGradient
              colors={['#56235E', '#C1392D']}
              locations={[0.2081, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.profileIcon}
            >
              <FontAwesome5 name="user-edit" size={24} color="#FFF" />
            </LinearGradient>
            <Text style={styles.profileHeaderText}>Update Your Information</Text>
          </View>

          <View style={[
            styles.verificationBadge,
            {
              backgroundColor: data?.isVerified ? '#4CAF50' : '#FFC107',
            }
          ]}>
            <Ionicons
              name={data?.isVerified ? "checkmark-circle" : "time"}
              size={16}
              color="#fff"
            />
            <Text style={styles.verificationText}>
              {data?.isVerified ? 'Verified Account' : 'Pending Verification'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>
                  <GradientText text={<Ionicons name="person-outline" size={20} color="#6C63FF" />} size={20} />
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                  placeholder="John Doe"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>
                  <GradientText text={<Ionicons name="mail-outline" size={20} color="#6C63FF" />} size={20} />
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  placeholder="example@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>
                  <GradientText text={<Ionicons name="call-outline" size={20} color="#6C63FF" />} size={20} />
                </Text>
                <TextInput
                  style={[styles.input, { color: '#888' }]}
                  value={formData.phoneNumber}
                  editable={false}
                  placeholder="+91 9876543210"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Account Role</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>
                  <GradientText text={<Ionicons name="key-outline" size={20} color="#6C63FF" />} size={20} />
                </Text>
                <TextInput
                  style={[styles.input, { color: '#888' }]}
                  value={data.role}
                  editable={false}
                  placeholder="Your role"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={isUpdating}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#56235E', '#C1392D']}
              locations={[0.2081, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {isUpdating ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#FFF" style={styles.buttonIcon} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      }
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 10,
  },
  verificationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    }),
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditUserScreen;