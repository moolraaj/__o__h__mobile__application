import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,

} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../navigation/AuthContext';
import { useGetSingleUserQuery, useUpdateUserMutation } from '../../store/services/user/userApi';
import { Layout } from '../../common/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ToastMessage } from '../../resuable/Toast';

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


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>

          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>


        <View style={[
          styles.verificationBadge,
          {
            backgroundColor: data?.isVerified ? '#4CAF50' : '#FFC107',
            alignSelf: 'flex-start',
            marginLeft: 16,
            marginBottom: 10
          }
        ]}>
          <Ionicons
            name={data?.isVerified ? "checkmark-circle" : "time"}
            size={16}
            color="#fff"
          />
          <Text style={styles.verificationText}>
            {data?.isVerified ? 'Verified' : 'Pending Verification'}
          </Text>
        </View>

        <LinearGradient
          colors={['#F8E4FF', '#FFD7D8']}
          locations={[0.2081, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.formContainer}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, { color: '#888' }]}
              value={formData.phoneNumber}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Role</Text>


            <TextInput
              style={[styles.input, { color: '#888' }]}
              value={data.role}
              editable={false}
            />

          </View>
        </LinearGradient>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={isUpdating}
        >
          <Text style={styles.saveButtonText}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#80225E',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  verificationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  formContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#80225E',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  roleIcon: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#80225E',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditUserScreen;