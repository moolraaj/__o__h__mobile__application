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

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);

  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [loginUser, { isLoading: loggingIn }] = useLoginUserMutation();

  
  const slideX = useRef(new Animated.Value(0)).current;

  const goToSlide = (index: number) => {
    Animated.timing(slideX, {
      toValue: -SCREEN_WIDTH * index,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      return ToastMessage('error', 'Please provide a valid number');
    }
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
    if (otp.length !== 6 || !requestId) {
      return ToastMessage('error', 'Enter the 6‑digit OTP');
    }
    try {
      const verifyRes = await verifyOtp({ requestId, otp }).unwrap();
      if (!verifyRes.isOTPVerified) {
        ToastMessage('error', 'Invalid OTP!');
        return;
      }
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

  return (
    <SafeAreaView style={styles.wrapper}>
      <Animated.View
        style={[
          styles.slider,
          { transform: [{ translateX: slideX }] },
        ]}
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
           <BackButton/>
            <Text style={styles.subtitle}>Enter OTP</Text>
          </View>
          <Input
            placeholder="6‑digit OTP"
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

          <TouchableOpacity
            onPress={handleSendOtp}
            style={{ marginTop: 10 }}
          >
            <Text style={{ textAlign: 'center', color: 'black' }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.footerLink}>
        <Text style={{ textAlign: 'center' }}>
          Do you have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: 'blue', textAlign: 'center' }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
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
}: {
  placeholder: string;
  icon: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  maxLength?: number;
  textCenter?: boolean;
}) {
  return (
    <View style={styles.inputWrapper}>
   
      <TextInput
        style={[
          styles.input,
          textCenter && { width: 160, textAlign: 'center' },
        ]}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
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

 
