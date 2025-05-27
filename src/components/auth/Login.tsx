import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import SuccessModal from './SuccessModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Login({ navigation }: { navigation: any }) {

  console.log(`API_BASE_URL`)
  console.log(API_BASE_URL)

  const { setToken, setUser } = useAuth();

  // At the top of your component:
  const [countryCode, setCountryCode] = useState<Country['cca2']>('IN');
  const [callingCode, setCallingCode] = useState<string>('91');


  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);


  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);

  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [loginUser, { isLoading: loggingIn }] = useLoginUserMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})



  const slideX = useRef(new Animated.Value(0)).current;
  const goToSlide = (index: number) => {
    Animated.timing(slideX, {
      toValue: -SCREEN_WIDTH * index,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };


  const handleSendOtp = async () => {
    if (!phoneNumber) return ToastMessage('error', 'Please provide a valid number');
    try {
      const data = await sendOtp({ phoneNumber: `+${callingCode}${phoneNumber}` }).unwrap();
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
    if (otp.length !== 6 || !requestId)
      return ToastMessage('error', 'Enter the 6-digit OTP')

    try {
      const verifyRes = await verifyOtp({ requestId, otp }).unwrap()
      if (!verifyRes.isOTPVerified)
        return ToastMessage('error', 'Invalid OTP!')


      const loginRes = await loginUser({ phoneNumber: `+${callingCode}${phoneNumber}` }).unwrap()


      await AsyncStorage.multiSet([
        ['authToken', loginRes.token],
        ['user', JSON.stringify(loginRes.user)],
      ])
      setToken(loginRes.token)
      setUser(loginRes.user)

      ToastMessage('success', loginRes.message || 'Logged in successfully')
      setShowSuccessModal(true)

    } catch (err: any) {
      ToastMessage('error', err?.data?.error || 'Server error')
    }
  }



  const handleEmailLogin = async () => {
    setFieldErrors({})
    try {
      const res = await loginUser({ email, password }).unwrap()

      ToastMessage('error', res?.error || 'provide valid credentials')
    } catch (err: any) {

      if (err.data?.errors) {
      } else {
        ToastMessage('error', err.data?.error || 'provide valid credentials')
      }
    }
  }


  return (
    <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {showSuccessModal && <SuccessModal
          visible={showSuccessModal}
          message="Otp Verified successful!"
          onClose={() => setShowSuccessModal(false)}
          phoneNumber={phoneNumber}
          callingCode={callingCode}
        />}

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

            <View style={styles.slide}>
              <Input
                placeholder="e.g. johndoe@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                icon="mail"
                name='Email'
              />
              <Input
                placeholder="e.g. securepassword"
                keyboardType="default"
                value={password}
                onChangeText={setPassword}
                icon="lock"
                secureTextEntry={!showPassword}
                name='Password'
                isPassword
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
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
                          setCallingCode(country.callingCode[0]); // Use the first element of the array
                        }}
                      />
                      <View style={styles.phoneInputField}>
                        <Text style={styles.prefixText}>+{callingCode}</Text>
                        <TextInput
                          style={styles.phoneInput}
                          placeholder="0000 000 000"
                          keyboardType="phone-pad"
                          value={phoneNumber}
                          onChangeText={setPhoneNumber}
                          maxLength={10}
                        />
                      </View>
                    </View>
                  </View>

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
                    <Text style={styles.subtitle}>OTP</Text>
                  </View>
                  <Input
                    placeholder="6-digit OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    name='Enter Otp'
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
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{name}</Text>
      <View style={styles.inputRow}>
        <GradientText text={<Feather name={icon} size={22} color="#56235E" />} />
        <TextInput
          style={styles.input}
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
  input: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '500',
    color: '#56235E',
    marginLeft: 5,
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
