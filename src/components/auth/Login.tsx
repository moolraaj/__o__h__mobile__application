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
  ScrollView
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
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import SuccessModal from './SuccessModal';
import { FlatList } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Login({ navigation }: { navigation: any }) {

  // NEW: For horizontal scroll tracking
  const flatListRef = useRef<FlatList>(null);

  // At the top of your component:
  const [countryCode, setCountryCode] = useState<Country['cca2']>('IN');
  const [callingCode, setCallingCode] = useState<string>('91'); // Not string[]

  // NEW: which method is active?
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);

  // PHONE flow state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [loginUser, { isLoading: loggingIn }] = useLoginUserMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // EMAIL flow state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // for PHONE slider
  const slideX = useRef(new Animated.Value(0)).current;
  const goToSlide = (index: number) => {
    Animated.timing(slideX, {
      toValue: -SCREEN_WIDTH * index,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Also update your handleScrollEnd function to properly handle the index:
  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setLoginMethod(index === 0 ? 'email' : 'phone');
  };

  const switchTab = (index: number) => {
    const method = index === 0 ? 'email' : 'phone';
    setLoginMethod(method);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });

    // If switching to phone tab, reset the phone flow to initial state
    if (method === 'phone') {
      setPhoneNumber('');
      setOtp('');
      setRequestId(null);
      setPhoneError('');
      setOtpError('');
    }
  };

  // PHONE handlers
  const handleSendOtp = async () => {
    setPhoneError('');
    if (!phoneNumber) {
      setPhoneError('Please provide a valid number');
      return;
    }
    try {
      const data = await sendOtp({ phoneNumber: `+${callingCode}${phoneNumber}` }).unwrap();
      const rid = data.requestId ?? data.request_id;
      setRequestId(rid);
      setOtp('');
      ToastMessage('success', `OTP sent to ${phoneNumber}`);
      goToSlide(1);
    } catch (err: any) {
      const errorMessage = err?.data?.error || 'Failed to send OTP';
      setPhoneError(errorMessage);
      ToastMessage('error', errorMessage);
    }
  };
  const handleVerifyOtp = async () => {
    setOtpError('');
    if (otp.length !== 6 || !requestId) {
      setOtpError('Enter the 6-digit OTP');
      return;
    }
    try {
      const verifyRes = await verifyOtp({ requestId, otp }).unwrap();
      if (!verifyRes.isOTPVerified) {
        setOtpError('Invalid OTP!');
        return ToastMessage('error', 'Invalid OTP!');
      }
      setShowSuccessModal(true);
    } catch (err: any) {
      const errorMessage = err?.data?.error || 'Server error';
      setOtpError(errorMessage);
      ToastMessage('error', errorMessage);
    }
  };

  const handleEmailLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }



    try {
      await loginUser({ email, password }).unwrap();
      if (!email || !password) {
        return ToastMessage('error', 'Plese Provide Valid Credentails!');
      }
      setShowSuccessModal(true);
    } catch (err: any) {
      const errorMessage = err?.data?.error || 'provide valid credentials';
      if (errorMessage.toLowerCase().includes('email')) {
        setEmailError(errorMessage);
      } else if (errorMessage.toLowerCase().includes('password')) {
        setPasswordError(errorMessage);
      } else {
        ToastMessage('error', errorMessage);
      }
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {showSuccessModal && <SuccessModal
          visible={showSuccessModal}
          message={
            loginMethod === 'phone'
              ? "OTP Verified successfully!"
              : "Logged in successfully!"
          }
          onClose={() => setShowSuccessModal(false)}
          phoneNumber={phoneNumber}
          email={email}
          password={password}
          callingCode={callingCode}
          loginMethod={loginMethod}
        />}
        <View style={{ margin: 20 }}>
          {loginMethod === 'email' ?
            <Text style={styles.headerText}>Login via Email</Text>
            : <Text style={styles.headerText}>Login via Phone</Text>}
        </View>
        <View style={{ margin: 20 }}>
          {loginMethod === 'email' ?
            <Text style={styles.headerSubtext}>Please enter your email and password to continue</Text> :
            <Text style={styles.headerSubtext}>Enter your phone number, and we'll send you a confirmation code</Text>}
        </View>

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
                onPress={() => {
                  switchTab(0);
                }}
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
                onPress={() => {
                  switchTab(1);
                }}
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
        <FlatList
          ref={flatListRef}
          data={['email', 'phone']}
          horizontal
          pagingEnabled
          initialScrollIndex={loginMethod === 'phone' ? 1 : 0}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH }}>
              {item === 'email' ? (
                <View style={styles.slide}>
                  <Input
                    placeholder="e.g. johndoe@example.com"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError('');
                    }}
                    icon="mail"
                    name='Email'
                    error={emailError}
                  />
                  <Input
                    placeholder="e.g. securepassword"
                    keyboardType="default"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setPasswordError('');
                    }}
                    icon="lock"
                    secureTextEntry={!showPassword}
                    name='Password'
                    isPassword
                    showPassword={showPassword}
                    toggleShowPassword={() => setShowPassword(!showPassword)}
                    error={passwordError}
                  />
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.forgotPasswordLink}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <View style={{ marginTop: 30 }}>
                    <GradientButton
                      label={loggingIn ? 'Login...' : 'Login'}
                      onPress={handleEmailLogin}
                    />
                  </View>
                </View>
              ) : (
                <Animated.View
                  style={[styles.slider, { transform: [{ translateX: slideX }] }]}
                >
                  <View style={styles.slide}>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.label}>Phone Number</Text>
                      <View style={styles.inputRow}>
                        <CountryPicker
                          countryCode={countryCode}
                          withFlag
                          withCallingCode
                          withFilter
                          withEmoji
                          onSelect={(country: Country) => {
                            setCountryCode(country.cca2);
                            setCallingCode(country.callingCode[0]);
                          }}
                        />
                        <View style={styles.phoneInputField}>
                          <Text style={styles.prefixText}>+{callingCode}</Text>
                          <TextInput
                            style={styles.phoneInput}
                            placeholder="0000 000 000"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={(text) => {
                              setPhoneNumber(text);
                              setPhoneError('');
                            }}
                            maxLength={10}
                          />
                        </View>
                      </View>
                      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                    </View>

                    <View style={{ marginTop: 30 }}>
                      <GradientButton
                        label={sending ? 'Sending OTP...' : 'Send OTP'}
                        onPress={handleSendOtp}
                      />
                    </View>
                  </View>
                  <View style={styles.slide}>
                    <View style={styles.header}>
                      <BackButton onPress={() => goToSlide(0)} />
                      <Text style={styles.subtitle}>OTP</Text>
                    </View>
                    <Input
                      placeholder="6-digit OTP"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otp}
                      name='Enter Otp'
                      onChangeText={(text) => {
                        setOtp(text);
                        setOtpError('');
                      }}
                      icon="key"
                      error={otpError}
                    />
                    <GradientButton
                      label={verifying || loggingIn ? 'verifying...' : 'Verify OTP'}
                      onPress={handleVerifyOtp}
                    />
                    <TouchableOpacity onPress={handleSendOtp} style={{ marginTop: 10 }}>
                      <Text style={{ textAlign: 'center', color: 'black' }}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
            </View>
          )}
          keyExtractor={(item) => item}
        />


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
      </ScrollView>
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
  secureTextEntry = false,
  name,
  isPassword = false,
  showPassword,
  toggleShowPassword,
  error,
  textCenter = false,
}: {
  placeholder: string;
  icon: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  maxLength?: number;
  textCenter?: boolean;
  secureTextEntry?: boolean;
  name: string;
  isPassword?: boolean;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
  error?: string;
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{name}</Text>
      <View style={[
        styles.inputRow,
        error ? styles.inputError : null,
        textCenter ? { justifyContent: 'center' } : null
      ]}>
        <GradientText text={<Feather name={icon} size={22} color="#56235E" />} />
        <TextInput
          style={[
            styles.input,
            textCenter ? { textAlign: 'center' } : null
          ]}
          placeholder={placeholder}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleShowPassword}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  phoneInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prefixText: {
    fontSize: 16,
    color: '#56235E',
    marginRight: 8,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#56235E',
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
    alignItems: 'flex-start',
    color: "#222222",
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: '#DE2027',
  },
  input: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '500',
    color: '#56235E',
    marginLeft: 5,
  },
  errorText: {
    position: 'absolute',
    bottom: -16,
    color: '#DE2027',
    fontSize: 12,
    marginLeft: 12
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginHorizontal: 2,
  },
  forgotPasswordText: {
    color: '#6a3093',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline'
  },
  footerLink: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    margin: 20,
    gap: 5,
  },
  bottomText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});