import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
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
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import Loader from '../../common/Loader';
import { API_BASE_URL } from '@env'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Login({ navigation }: { navigation: any }) {

  console.log(`API_BASE_URL`)
  console.log(API_BASE_URL)

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
      {/* Header */}
      <View style={{ margin: 20 }}>
        {loginMethod === 'email' ?
          <Text style={styles.headerText}>Login via Email</Text>
          : <Text style={styles.headerText}>Login via Phone</Text>}
      </View>
      <View style={{ margin: 20 }}>
        {loginMethod === 'email' ?
          <Text style={styles.headerSubtext}>Please enter your email and password to continue</Text> :
          <Text style={styles.headerSubtext}>Enter your phone number, and we’ll send you a confirmation code</Text>}
      </View>
      {/* Toggle buttons */}
      <View style={styles.toggleContainer}>
        <LinearGradient
          colors={['rgba(222, 32, 39, 0.16)', '#E39EFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                loginMethod === 'email' && styles.activeButton,
              ]}
              onPress={() => setLoginMethod('email')}
            >
              <Text
                style={[
                  styles.toggleText,
                  loginMethod === 'email' && styles.activeText,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                loginMethod === 'phone' && styles.activeButton,
              ]}
              onPress={() => setLoginMethod('phone')}
            >
              <Text
                style={[
                  styles.toggleText,
                  loginMethod === 'phone' && styles.activeText,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      {
        loginMethod === 'email' ? (
          // ——————— EMAIL LOGIN ———————
          <View style={styles.slide}>
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
              <Loader />
            ) : (
              <View style={{ marginTop: 30 }}>
                <GradientButton
                  label="Login"
                  onPress={handleEmailLogin}
                />
              </View>
            )}
          </View>
        ) : (
          // ——————— PHONE LOGIN (OTP) ———————
          <>
            <Animated.View
              style={[styles.slider, { transform: [{ translateX: slideX }] }]}
            >
              <View style={styles.slide}>
                <Input
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  icon="smartphone"
                />
                <View style={{ marginTop: 30 }}>
                  <GradientButton
                    label={sending ? 'Sending OTP…' : 'Send OTP'}
                    onPress={handleSendOtp}
                  />
                </View>
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
                  <Loader />
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

          </>
        )
      }
      <View style={styles.footerLink}>
        <Text style={{ textAlign: 'center' }}>Do you have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <GradientText text="Sign Up" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>By clicking Continue, you agree to our </Text>
        <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
          <GradientText text="Terms of Service" size={12} />
        </TouchableOpacity>
        <Text style={styles.bottomText}> and </Text>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <GradientText text="Privacy Policy" size={12} />
        </TouchableOpacity>
      </View>
    </SafeAreaView >
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
      <GradientText text={
        <Feather name={icon} size={22} color="#56235E" />
      } />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  headerSubtext: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    color: '#555',
  },
  toggleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  gradientBackground: {
    width: '90%',
    borderRadius: 30,
    padding: 2,
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 30,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 30,
  },
  activeButton: {
    backgroundColor: '#fff',
  },
  toggleText: {
    color: '#222',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#E03976',
  },
  slider: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
  },
  slide: {
    width: SCREEN_WIDTH,
    padding: 18,
    justifyContent: 'center',
    gap: 8,
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  input: {
    width: '100%',
    fontSize: 16,
    fontWeight: '500',
    color: '#56235E',
  },
  footerLink: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    gap: 5,
  },
  
  bottomText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },  
});
