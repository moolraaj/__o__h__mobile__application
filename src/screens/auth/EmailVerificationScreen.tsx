
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import GradientButton from '../../resuable/Button';
import { useSendEmailVerificationMutation } from '../../store/services/user/userApi';
import Loader from '../../common/Loader';
import { GlobalText } from '../../constants/GlobalText';

const EmailVerificationScreen = ({ navigation }: { navigation: any }) => {

  const route = useRoute();

  const { email, userId } = route.params as { email: string; userId: string };


  const [sendEmailVerification, { isLoading: isSendingEmail }] = useSendEmailVerificationMutation();

  const handleResendEmail = async () => {
    try {
      await sendEmailVerification({ userId }).unwrap();
      Alert.alert('Success', `Verification email resent to ${email}`);
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to resend verification email.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.wrapper}>
      <GlobalText style={styles.infoText}>
        An email has been sent to {email}. Please verify your account before you log in.
      </GlobalText>

      {isSendingEmail && <Loader />}

      <GradientButton label="Resend Email" onPress={handleResendEmail} />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <GlobalText style={styles.loginText}>Login</GlobalText>
      </TouchableOpacity>
    </View>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: 'blue',
  },
});
