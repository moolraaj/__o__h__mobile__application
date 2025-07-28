// File: screens/Register.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
 
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
 
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import {
  BACK_ARROW_COLOR,
  INPUT_ICON_COLOR,
  INPUT_ICON_SIZE,
} from '../../constants/Variables';
import GradientButton from '../../resuable/Button';
import GradientText from '../../common/GradientText';
import { useRegisterUserMutation } from '../../store/services/user/userApi';
import { useSaveFcmToken } from '../../common/saveFcmTokens'; 

export default function Register({ navigation }: { navigation: any }) {
    const saveFcmToken = useSaveFcmToken();
  const [step, setStep] = useState(1);
  const [user, setUsers] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [countryCode, setCountryCode] = useState<Country['cca2']>('IN');
  const [callingCode, setCallingCode] = useState<string>('91');

  const [register, { isLoading: isRegistering, error: registerError }] =
    useRegisterUserMutation();

  useEffect(() => {
    if (!registerError) return;
    const err = registerError as any;
    const msg =
      err.data?.error || err.error || 'Registration failed';
    Toast.show({ type: 'error', text1: msg });
  }, [registerError]);

  const roles = [
    { key: 'user', label: 'User', color: '#FFA500', icon: 'people-circle-outline' },
    { key: 'dantasurakshaks', label: 'Dantasurakshaks', color: '#FF5C5C', icon: 'alert-circle-outline' },
    { key: 'admin', label: 'Admin', color: '#8A2BE2', icon: 'person-outline' },
  ];

  const onChangeField = (field: keyof typeof user, val: string) => {
    setUsers(prev => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (!user.role) {
      return Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Role is required!',
      });
    }
    setStep(2);
  };

  const handleRegister = async () => {
    try {
      const registrationData = {
        ...user,
        phoneNumber: `+${callingCode}${user.phoneNumber}`,
      };
      const result = await register(registrationData).unwrap();
      navigation.navigate('EmailVerification', {
        email: user.email,
        userId: result.id,
      });
       
    } catch (e: any) {
      const msg =
        e.data?.error || e.error || 'Registration failed. Please try again.';
      Toast.show({ type: 'error', text1: msg });
    }
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <View>
            <Text style={styles.title}>Join Us</Text>
            <Image source={require('../../images/home_slide_one.png')} />
            {roles.map(r => (
              <TouchableOpacity
                key={r.key}
                onPress={() => onChangeField('role', r.key)}
                style={[
                  styles.roleContainer,
                  user.role === r.key && { backgroundColor: r.color },
                  { borderColor: user.role === r.key ? 'white' : r.color },
                ]}
              >
                <View style={styles.roleWrapper}>
                  <Ionicons
                    name={r.icon}
                    size={24}
                    color={user.role === r.key ? 'white' : r.color}
                  />
                  <Text
                    style={[
                      styles.roleText,
                      user.role === r.key && { color: 'white' },
                    ]}
                  >
                    {r.label}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor: user.role === r.key ? 'white' : r.color,
                      padding: user.role === r.key ? 2 : 0,
                    },
                  ]}
                >
                  {user.role === r.key && (
                    <View
                      style={[
                        styles.radioInner,
                        { backgroundColor: 'white', margin: 2 },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ marginTop: 30 }}>
              <GradientButton label="Next" onPress={handleNext} />
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setStep(1)} style={styles.prevButton}>
                <Ionicons name="chevron-back" size={24} color={BACK_ARROW_COLOR} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Account</Text>
            </View>
            <View style={styles.textInputMainWrapper}>
              {(['name', 'email', 'password'] as const).map(field => (
                <View key={field} style={styles.textInputWrapper}>
                  <Text style={styles.label}>
                    {field[0].toUpperCase() + field.slice(1)}
                  </Text>
                  <View style={styles.inputRow}>
                    {field === 'name' && <AntDesign name="user" size={INPUT_ICON_SIZE} color={INPUT_ICON_COLOR} />}
                    {field === 'email' && <AntDesign name="mail" size={INPUT_ICON_SIZE} color={INPUT_ICON_COLOR} />}
                    {field === 'password' && <AntDesign name="lock" size={INPUT_ICON_SIZE} color={INPUT_ICON_COLOR} />}
                    <TextInput
                      style={styles.textInput}
                      placeholder={
                        field === 'name'
                          ? 'e.g. John Doe'
                          : field === 'email'
                            ? 'e.g. johndoe@example.com'
                            : 'e.g. securepassword'
                      }
                      value={(user as any)[field]}
                      onChangeText={v => onChangeField(field, v)}
                      secureTextEntry={field === 'password' && !showPassword}
                      keyboardType={field === 'email' ? 'email-address' : 'default'}
                    />
                    {field === 'password' && (
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              <View style={styles.textInputWrapper}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputRow}>
                  <AntDesign name="lock" size={INPUT_ICON_SIZE} color={INPUT_ICON_COLOR} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. securepassword"
                    value={user.confirmPassword}
                    onChangeText={v => {
                      onChangeField('confirmPassword', v);
                      if (user.password && v !== user.password) {
                        setPasswordError('Passwords do not match');
                      } else {
                        setPasswordError('');
                      }
                    }}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={18} color="#666" />
                  </TouchableOpacity>
                </View>
                {passwordError !== '' && (
                  <Text style={styles.errorText}>{passwordError}</Text>
                )}
              </View>

              <View style={styles.textInputWrapper}>
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
                  <Text style={styles.prefixText}>+{callingCode}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0000 000 000"
                    value={user.phoneNumber}
                    onChangeText={v => onChangeField('phoneNumber', v)}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <View style={styles.buttonWrapper}>
              <GradientButton
                label={isRegistering ? 'Registering…' : 'Create Account'}
                onPress={handleRegister}
              />
            </View>
          </View>
        )}

        <View style={styles.footerLink}>
          <Text>I'm already a member</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <GradientText text="Login" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 18, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: '700' },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  prefixText: {
    fontSize: 16,
    color: '#56235E',
    fontWeight: '500',
  },
  roleWrapper: { flexDirection: 'row', alignItems: 'center' },
  roleText: { fontSize: 16, marginLeft: 8 },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { height: 12, width: 12, borderRadius: 6 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  prevButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 10 },
  textInputMainWrapper: { marginBottom: 20 },
  textInputWrapper: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'flex-start',
    color: '#222222',
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
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    marginLeft: 5,
    textAlign: 'left',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  buttonWrapper: { marginTop: 30 },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
});
