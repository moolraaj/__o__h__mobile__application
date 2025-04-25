import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import GradientButton from '../../resuable/Button';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
} from '../../store/services/user/userApi';
import { useAuth } from '../../navigation/AuthContext';
import { ToastMessage } from '../../resuable/Toast';
import BackButton from '../../resuable/BackButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Login({ navigation }: { navigation: any }) {
  const { setToken, setUser } = useAuth();

  // NEW: which method is active?
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');

  // PHONE flow state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);

  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [loginUser, { isLoading: loggingIn }] = useLoginUserMutation();

  // EMAIL flow state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // for PHONE slider
  const slideX = useRef(new Animated.Value(0)).current;
  const goToSlide = (index: number) => {
    Animated.timing(slideX, {
      toValue: -SCREEN_WIDTH * index,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // PHONE handlers
  const handleSendOtp = async () => {
    if (!phoneNumber) return ToastMessage('error', 'Please provide a valid number');
    try {
      const data = await sendOtp({ phoneNumber }).unwrap();
      const rid = data.requestId ?? data.request_id;
      setRequestId(rid);
      setOtp('');
      ToastMessage('success', `OTP sent to ${phoneNumber}`);
      goToSlide(1);
    } catch (err: any) {
      ToastMessage('error', err?.data?.error || 'Failed to send OTP');
    }
  };
  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !requestId) return ToastMessage('error', 'Enter the 6-digit OTP');
    try {
      const verifyRes = await verifyOtp({ requestId, otp }).unwrap();
      if (!verifyRes.isOTPVerified) return ToastMessage('error', 'Invalid OTP!');
      // now login
      const loginRes = await loginUser({ phoneNumber }).unwrap();
      await AsyncStorage.multiSet([
        ['authToken', loginRes.token],
        ['user', JSON.stringify(loginRes.user)],
      ]);
      setToken(loginRes.token);
      setUser(loginRes.user);
      ToastMessage('success', loginRes.message || 'Logged in successfully');
    } catch (err: any) {
      ToastMessage('error', err?.data?.error || 'Server error');
    }
  };

  // EMAIL handler
  const handleEmailLogin = async () => {
    if (!email || !password) return ToastMessage('error', 'Email and password required');
    try {
      const loginRes = await loginUser({ email, password }).unwrap();
      await AsyncStorage.multiSet([
        ['authToken', loginRes.token],
        ['user', JSON.stringify(loginRes.user)],
      ]);
      setToken(loginRes.token);
      setUser(loginRes.user);
      ToastMessage('success', loginRes.message || 'Logged in successfully');
    } catch (err: any) {
      ToastMessage('error', err?.data?.error || 'Login failed');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Toggle buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            loginMethod === 'email' && styles.toggleActive,
          ]}
          onPress={() => setLoginMethod('email')}
        >
          <Text
            style={[
              styles.toggleText,
              loginMethod === 'email' && styles.toggleTextActive,
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            loginMethod === 'phone' && styles.toggleActive,
          ]}
          onPress={() => setLoginMethod('phone')}
        >
          <Text
            style={[
              styles.toggleText,
              loginMethod === 'phone' && styles.toggleTextActive,
            ]}
          >
            Phone
          </Text>
        </TouchableOpacity>
      </View>

      {loginMethod === 'email' ? (
        // ——————— EMAIL LOGIN ———————
        <View style={styles.slide}>
          <Text style={styles.title}>Login via Email</Text>
          <Input
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            icon="mail"
          />
          <Input
            placeholder="Password"
            keyboardType="default"
            value={password}
            onChangeText={setPassword}
            icon="lock"
            secureTextEntry
          />
          {loggingIn ? (
            <ActivityIndicator />
          ) : (
            <GradientButton
              label="Login"
              onPress={handleEmailLogin}
            />
          )}
        </View>
      ) : (
        // ——————— PHONE LOGIN (OTP) ———————
        <>
          <Animated.View
            style={[styles.slider, { transform: [{ translateX: slideX }] }]}
          >
            <View style={styles.slide}>
              <Text style={styles.title}>Login via Phone</Text>
              <Input
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                icon="smartphone"
              />
              <GradientButton
                label={sending ? 'Sending OTP…' : 'Send OTP'}
                onPress={handleSendOtp}
              />
            </View>
            <View style={styles.slide}>
              <View style={styles.header}>
                <BackButton onPress={() => goToSlide(0)} />
                <Text style={styles.subtitle}>Enter OTP</Text>
              </View>
              <Input
                placeholder="6-digit OTP"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                icon="key"
                textCenter
              />
              {verifying || loggingIn ? (
                <ActivityIndicator />
              ) : (
                <GradientButton
                  label="Verify OTP"
                  onPress={handleVerifyOtp}
                />
              )}
              <TouchableOpacity onPress={handleSendOtp} style={{ marginTop: 10 }}>
                <Text style={{ textAlign: 'center', color: 'black' }}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <View style={styles.footerLink}>
            <Text style={{ textAlign: 'center' }}>Do you have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: 'blue', textAlign: 'center' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function Input({
  placeholder,
  icon,
  value,
  onChangeText,
  keyboardType = 'default',
  maxLength,
  textCenter = false,
  secureTextEntry = false,
}: {
  placeholder: string;
  icon: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  maxLength?: number;
  textCenter?: boolean;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.input, textCenter && { width: 160, textAlign: 'center' }]}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      <Feather name={icon} size={22} color="#555" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  toggleActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    textAlign: 'center',
    color: '#555',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  slider: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
  },
  slide: {
    width: SCREEN_WIDTH,
    padding: 18,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    padding: 14,
    paddingLeft: 45,
    borderRadius: 6,
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    top: 18,
    left: 14,
  },
  footerLink: {
    padding: 18,
  },
});
