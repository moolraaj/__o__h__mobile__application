import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../navigation/AuthContext';
import { useForgotPasswordMutation } from '../../store/services/user/userApi';
import { Layout } from '../../common/Layout';
import { ToastMessage } from '../../resuable/Toast';

export const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();

  console.log(`user`)
  console.log(user)
  const [email, setEmail] = useState('');
  const [sendOtp, { isLoading }] = useForgotPasswordMutation();

  const handleSendOtp = async () => {
    if (!email) {
      return ToastMessage('error', 'Please enter your email');
    }
    if (email !== user?.email) {
      return ToastMessage('error', 'Email does not match your account');
    }
    try {
      const res = await sendOtp({ email }).unwrap();
      ToastMessage('success', res.message);
      navigation.navigate('SettingForgotPasswordScreen', { email });
    } catch (err: any) {
      ToastMessage('error', err.data?.error || 'Failed to send OTP');
    }
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <Text style={styles.title}>Forgot Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your registered email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabled]}
          onPress={handleSendOtp}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending OTP…' : 'Send OTP'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#80225E',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#80225E',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#80225E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
