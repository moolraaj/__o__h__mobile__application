// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     TextInput,
//     StyleSheet,
//     Image,
//     SafeAreaView,
//     ActivityIndicator
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import Toast from 'react-native-toast-message';
// import {
//     BACK_ARROW_COLOR,
//     FONT_SIZE,
//     INPUT_BACKGROUND,
//     INPUT_BORDER_COLOR,
//     INPUT_ICON_COLOR,
//     INPUT_ICON_SIZE
// } from '../../constants/Variables';
// import GradientButton from '../../resuable/Button';
// import {
//     useRegisterUserMutation,
//     useSendOtpMutation,
//     useVerifyOtpMutation
// } from '../../store/services/user/userApi';

// const VERIFIABLE_ROLES = ['admin', 'dantasurakshaks'] as const;

// export default function Register({ navigation }: { navigation: any }) {
//     const [step, setStep] = useState(1);
//     const [user, setUsers] = useState({
//         role: '',
//         name: '',
//         email: '',
//         password: '',
//         phoneNumber: ''
//     });
//     const [otp, setOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);
//     const [requestId, setRequestId] = useState<string | null>(null);

//     const [register, { isLoading: isRegistering, error: registerError }] =
//         useRegisterUserMutation();
//     const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
//     const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

//     useEffect(() => {
//         if (!registerError) return;
//         const err = registerError as any;
//         const msg =
//             err.data?.error
//                 ? err.data.error
//                 : err.error
//                 || 'Registration failed';
//         Toast.show({ type: 'error', text1: msg });
//     }, [registerError]);

//     const roles = [
//         { key: 'user', label: 'User', color: '#FFA500', icon: 'people-circle-outline' },
//         { key: 'dantasurakshaks', label: 'Dantasurakshaks', color: '#FF5C5C', icon: 'alert-circle-outline' },
//         { key: 'admin', label: 'Admin', color: '#8A2BE2', icon: 'person-outline' }
//     ];

//     const onChangeField = (field: keyof typeof user, val: string) => {
//         setUsers(prev => ({ ...prev, [field]: val }));
//         if (field === 'phoneNumber') {
//             setOtpSent(false);
//             setOtpVerified(false);
//             setOtp('');
//         }
//     };

//     const handleNext = () => {
//         if (!user.role) {
//             return Toast.show({
//                 type: 'error',
//                 position: 'top',
//                 text1: 'Role is required!'
//             });
//         }
//         setStep(2);
//     };

//     const handleSendOtp = async () => {
//         try {
//             const { requestId } = await sendOtp({ phoneNumber: user.phoneNumber }).unwrap();
//             setRequestId(requestId);
//             setOtpSent(true);
//             setOtpVerified(false);
//             setOtp('');
//             Toast.show({ type: 'success', text1: 'OTP sent!' });
//         } catch (e: any) {
//             const msg = e.data?.error || e.error || 'Failed to send OTP. Please try again.';
//             Toast.show({ type: 'error', text1: msg });
//         }
//     };

//     const handleVerifyOtp = async () => {
//         if (otp.length !== 6 || !requestId)
//             return Toast.show({ type: 'error', text1: 'Enter the full 6‑digit OTP.' });

//         try {
//             const { isOTPVerified } = await verifyOtp({ requestId, otp }).unwrap();
//             if (!isOTPVerified) throw new Error('Invalid OTP');

//             setOtpVerified(true);
//             Toast.show({ type: 'success', text1: 'OTP verified!' });
//         } catch (e: any) {
//             const msg = e.message || e.data?.error || 'OTP verification failed.';
//             Toast.show({ type: 'error', text1: msg });
//         }
//     };

//     const handleRegister = async () => {
//         try {
//             const result = await register(user).unwrap();
//             const newUserId = result.id;

//             if (VERIFIABLE_ROLES.includes(user.role as any)) {
//                 navigation.navigate('EmailVerificationScreen', {
//                     email: user.email,
//                     userId: newUserId
//                 });
//             } else {
//                 navigation.navigate('Login');
//             }
//         } catch (e: any) {
//             const msg =
//                 e.data?.error || e.error || 'Registration failed. Please try again.';
//             Toast.show({ type: 'error', text1: msg });
//         }
//     };

//     return (
//         <SafeAreaView style={styles.wrapper}>
//             {step === 1 ? (
//                 <View>
//                     <Text style={styles.title}>Join Us</Text>
//                     <Image source={require('../../images/home_slide_one.png')} />
//                     {roles.map(r => (
//                         <TouchableOpacity
//                             key={r.key}
//                             onPress={() => onChangeField('role', r.key)}
//                             style={styles.roleContainer}
//                         >
//                             <View style={styles.roleWrapper}>
//                                 <Ionicons name={r.icon} size={24} color={r.color} />
//                                 <Text style={styles.roleText}>{r.label}</Text>
//                             </View>
//                             <View style={[styles.radioOuter, { borderColor: r.color }]}>
//                                 {user.role === r.key && (
//                                     <View
//                                         style={[styles.radioInner, { backgroundColor: r.color }]}
//                                     />
//                                 )}
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                     <GradientButton label="Next" onPress={handleNext} />
//                 </View>
//             ) : (
//                 <View>
//                     <View style={styles.header}>
//                         <TouchableOpacity
//                             onPress={() => setStep(1)}
//                             style={styles.prevButton}
//                         >
//                             <Ionicons
//                                 name="chevron-back"
//                                 size={24}
//                                 color={BACK_ARROW_COLOR}
//                             />
//                         </TouchableOpacity>
//                         <Text style={styles.headerTitle}>Create Account</Text>
//                     </View>

//                     <View style={styles.textInputMainWrapper}>
//                         {(['name', 'email', 'password'] as const).map(field => (
//                             <View key={field} style={styles.textInputWrapper}>
//                                 <TextInput
//                                     style={styles.textInput}
//                                     placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                                     value={(user as any)[field]}
//                                     onChangeText={v => onChangeField(field, v)}
//                                     secureTextEntry={field === 'password'}
//                                     keyboardType={field === 'email' ? 'email-address' : 'default'}
//                                 />
//                                 {field === 'name' && (
//                                     <AntDesign
//                                         name="user"
//                                         size={INPUT_ICON_SIZE}
//                                         color={INPUT_ICON_COLOR}
//                                         style={styles.textInputIcon}
//                                     />
//                                 )}
//                                 {field === 'email' && (
//                                     <AntDesign
//                                         name="mail"
//                                         size={INPUT_ICON_SIZE}
//                                         color={INPUT_ICON_COLOR}
//                                         style={styles.textInputIcon}
//                                     />
//                                 )}
//                                 {field === 'password' && (
//                                     <AntDesign
//                                         name="lock"
//                                         size={INPUT_ICON_SIZE}
//                                         color={INPUT_ICON_COLOR}
//                                         style={styles.textInputIcon}
//                                     />
//                                 )}
//                             </View>
//                         ))}

//                         <View style={styles.textInputWrapper}>
//                             <TextInput
//                                 style={styles.textInput}
//                                 placeholder="Phone Number"
//                                 value={user.phoneNumber}
//                                 onChangeText={v => onChangeField('phoneNumber', v)}
//                                 keyboardType="phone-pad"
//                             />
//                             <Feather
//                                 name="smartphone"
//                                 size={INPUT_ICON_SIZE}
//                                 color={INPUT_ICON_COLOR}
//                                 style={styles.textInputIcon}
//                             />
//                         </View>
//                     </View>

//                     {!otpSent && user.phoneNumber && (
//                         <GradientButton
//                             label={isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
//                             onPress={handleSendOtp}
//                         />
//                     )}

//                     {otpSent && (
//                         <View style={{ marginTop: 20 }}>
//                             <Text style={{ marginBottom: 8 }}>Enter OTP:</Text>
//                             <TextInput
//                                 style={[styles.textInput, { width: 120, textAlign: 'center' }]}
//                                 placeholder="123456"
//                                 value={otp}
//                                 onChangeText={setOtp}
//                                 keyboardType="number-pad"
//                                 maxLength={6}
//                             />

//                             {!otpVerified ? (
//                                 isVerifyingOtp ? (
//                                     <ActivityIndicator style={{ marginVertical: 10 }} />
//                                 ) : (
//                                     <GradientButton
//                                         label="Verify OTP"
//                                         onPress={handleVerifyOtp}
//                                     />
//                                 )
//                             ) : null}

//                             {!otpVerified && (
//                                 <TouchableOpacity
//                                     onPress={handleSendOtp}
//                                     style={{ marginTop: 10 }}
//                                 >
//                                     <Text style={{ color: 'blue', textAlign: 'center' }}>
//                                         Resend OTP
//                                     </Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     )}

//                     <View style={styles.buttonWrapper}>
//                         <GradientButton
//                             label={isRegistering ? 'Registering…' : 'Create Account'}
//                             onPress={handleRegister}
//                         />
//                     </View>
//                 </View>
//             )}

//             <View style={{ marginTop: 20, alignItems: 'center' }}>
//                 <Text>I'm already a member</Text>
//                 <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                     <Text style={{ color: 'blue' }}>Login</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     wrapper: { flex: 1, padding: 18, backgroundColor: '#fff' },
//     title: { fontSize: FONT_SIZE, marginBottom: 20, textAlign: 'center' },
//     roleContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: 10,
//         marginVertical: 8,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8
//     },
//     roleWrapper: { flexDirection: 'row', alignItems: 'center' },
//     roleText: { fontSize: 16, marginLeft: 8 },
//     radioOuter: {
//         height: 20,
//         width: 20,
//         borderRadius: 10,
//         borderWidth: 1,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     radioInner: { height: 12, width: 12, borderRadius: 6 },
//     header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
//     prevButton: { padding: 8 },
//     headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 10 },
//     textInputMainWrapper: { marginBottom: 20 },
//     textInputWrapper: { position: 'relative', marginBottom: 15 },
//     textInput: {
//         borderColor: INPUT_BORDER_COLOR,
//         borderWidth: 1,
//         paddingLeft: 45,
//         borderRadius: 6,
//         backgroundColor: INPUT_BACKGROUND,
//         padding: 14
//     },
//     textInputIcon: { position: 'absolute', top: 14, left: 14 },
//     buttonWrapper: { marginTop: 30 }
// });



import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import Loader from '../../common/Loader';

import {
  BACK_ARROW_COLOR,
  FONT_SIZE,
  INPUT_BACKGROUND,
  INPUT_BORDER_COLOR,
  INPUT_ICON_COLOR,
  INPUT_ICON_SIZE
} from '../../constants/Variables';
import GradientButton from '../../resuable/Button';
import GradientText from '../../common/GradientText';
import {
  useRegisterUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation
} from '../../store/services/user/userApi';

const VERIFIABLE_ROLES = ['admin', 'dantasurakshaks'] as const;

export default function Register({ navigation }: { navigation: any }) {
  const [step, setStep] = useState(1);
  const [user, setUsers] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const [register, { isLoading: isRegistering, error: registerError }] =
    useRegisterUserMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  useEffect(() => {
    if (!registerError) return;
    const err = registerError as any;
    const msg =
      err.data?.error
        ? err.data.error
        : err.error
        || 'Registration failed';
    Toast.show({ type: 'error', text1: msg });
  }, [registerError]);

  const roles = [
    { key: 'user', label: 'User', color: '#FFA500', icon: 'people-circle-outline' },
    { key: 'dantasurakshaks', label: 'Dantasurakshaks', color: '#FF5C5C', icon: 'alert-circle-outline' },
    { key: 'admin', label: 'Admin', color: '#8A2BE2', icon: 'person-outline' }
  ];

  const onChangeField = (field: keyof typeof user, val: string) => {
    setUsers(prev => ({ ...prev, [field]: val }));
    if (field === 'phoneNumber') {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp('');
    }
  };

  const handleNext = () => {
    if (!user.role) {
      return Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Role is required!'
      });
    }
    setStep(2);
  };

  const handleSendOtp = async () => {
    try {
      const { requestId } = await sendOtp({ phoneNumber: `+91${user.phoneNumber}` }).unwrap();
      setRequestId(requestId);
      setOtpSent(true);
      setOtpVerified(false);
      setOtp('');
      Toast.show({ type: 'success', text1: 'OTP sent!' });
    } catch (e: any) {
      const msg = e.data?.error || e.error || 'Failed to send OTP. Please try again.';
      Toast.show({ type: 'error', text1: msg });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !requestId)
      return Toast.show({ type: 'error', text1: 'Enter the full 6‑digit OTP.' });

    try {
      const { isOTPVerified } = await verifyOtp({ requestId, otp }).unwrap();
      if (!isOTPVerified) throw new Error('Invalid OTP');
      setOtpVerified(true);
      Toast.show({ type: 'success', text1: 'OTP verified!' });
    } catch (e: any) {
      const msg = e.message || e.data?.error || 'OTP verification failed.';
      Toast.show({ type: 'error', text1: msg });
    }
  };

  const handleRegister = async () => {
    try {
      const result = await register(user).unwrap();

      // ─── if role==='user', backend returns { token, user } → auto‑login ───
      if ('token' in result && result.token) {
        // persist
        await AsyncStorage.multiSet([
          ['authToken', result.token],
          ['user', JSON.stringify(result.user)]
        ]);
        // replace to your main app screen
        navigation.navigate('Dashboard');
        return;
      }
      // ────────────────────────────────────────────────────────────────────

      // otherwise (admin/dantasurakshaks): pending email verification
      navigation.navigate('EmailVerification', {
        email: user.email,
        userId: result.id
      });
    } catch (e: any) {
      const msg =
        e.data?.error || e.error || 'Registration failed. Please try again.';
      Toast.show({ type: 'error', text1: msg });
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
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
                { borderColor: user.role === r.key ? 'white' : r.color }
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
            <TouchableOpacity
              onPress={() => setStep(1)}
              style={styles.prevButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={BACK_ARROW_COLOR}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
          </View>

          <View style={styles.textInputMainWrapper}>
            {(['name', 'email', 'password'] as const).map(field => (
              <View key={field} style={styles.textInputWrapper}>
                {field === 'name' && (
                  <AntDesign
                    name="user"
                    size={INPUT_ICON_SIZE}
                    color={INPUT_ICON_COLOR}
                  />
                )}
                {field === 'email' && (
                  <AntDesign
                    name="mail"
                    size={INPUT_ICON_SIZE}
                    color={INPUT_ICON_COLOR}
                  />
                )}
                {field === 'password' && (
                  <AntDesign
                    name="lock"
                    size={INPUT_ICON_SIZE}
                    color={INPUT_ICON_COLOR}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  value={(user as any)[field]}
                  onChangeText={v => onChangeField(field, v)}
                  secureTextEntry={field === 'password'}
                  keyboardType={field === 'email' ? 'email-address' : 'default'}
                />
              </View>
            ))}

            <View style={styles.textInputWrapper}>
              <Feather
                name="smartphone"
                size={INPUT_ICON_SIZE}
                color={INPUT_ICON_COLOR}
              />
              <Text style={styles.prefixText}>+91</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Phone Number"
                value={user.phoneNumber}
                onChangeText={v => onChangeField('phoneNumber', v)}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          {!otpSent && user.phoneNumber && (
            <GradientButton
              label={isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
              onPress={handleSendOtp}
            />
          )}

          {otpSent && (
            <View >
              <Text style={{ marginBottom: 8 }}>Enter OTP:</Text>
              <View style={[styles.textInputWrapper, { width: 120, margin: 0 }]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="123456"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              {!otpVerified ? (
                isVerifyingOtp ? (
                  <Loader />
                ) : (
                  <View style={{ marginTop: 20 }}>
                    <GradientButton
                      label="Verify OTP"
                      onPress={handleVerifyOtp}
                    />
                  </View>
                )
              ) : null}
              {!otpVerified && (
                <TouchableOpacity
                  onPress={handleSendOtp}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ color: 'blue', textAlign: 'center' }}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 18, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: '700', },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8
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
    justifyContent: 'center'
  },
  radioInner: { height: 12, width: 12, borderRadius: 6 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  prevButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 10 },
  textInputMainWrapper: { marginBottom: 20 },
  textInputWrapper: {
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
    color:"#222222"
  },
  textInput: {
    width: '100%',
  },
  buttonWrapper: { marginTop: 30 },
  footerLink: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
});
