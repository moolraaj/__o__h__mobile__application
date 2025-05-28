// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { useAuth } from '../../navigation/AuthContext';
// import { useForgotPasswordMutation } from '../../store/services/user/userApi';
// import { Layout } from '../../common/Layout';
// import { ToastMessage } from '../../resuable/Toast';

// export const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
//   const { user } = useAuth();

//   console.log(`user`)
//   console.log(user)
//   const [email, setEmail] = useState('');
//   const [sendOtp, { isLoading }] = useForgotPasswordMutation();

//   const handleSendOtp = async () => {
//     if (!email) {
//       return ToastMessage('error', 'Please enter your email');
//     }
//     if (email !== user?.email) {
//       return ToastMessage('error', 'Email does not match your account');
//     }
//     try {
//       const res = await sendOtp({ email }).unwrap();
//       ToastMessage('success', res.message);
//       navigation.navigate('SettingForgotPasswordScreen', { email });
//     } catch (err: any) {
//       ToastMessage('error', err.data?.error || 'Failed to send OTP');
//     }
//   };

//   return (
//     <Layout>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.select({ ios: 'padding', android: undefined })}
//       >
//         <Text style={styles.title}>Forgot Password</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Email Address</Text>
//           <TextInput
//             style={styles.input}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             placeholder="Enter your registered email"
//             value={email}
//             onChangeText={setEmail}
//           />
//         </View>
//         <TouchableOpacity
//           style={[styles.button, isLoading && styles.disabled]}
//           onPress={handleSendOtp}
//           disabled={isLoading}
//         >
//           <Text style={styles.buttonText}>
//             {isLoading ? 'Sending OTP…' : 'Send OTP'}
//           </Text>
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#80225E',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     color: '#80225E',
//     marginBottom: 6,
//   },
//   input: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#80225E',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   disabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });












import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../navigation/AuthContext';
import { useForgotPasswordMutation } from '../../store/services/user/userApi';
import { Layout } from '../../common/Layout';
import { ToastMessage } from '../../resuable/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GradientText from '../../common/GradientText';

export const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={['#56235E', '#C1392D']}
              locations={[0.2081, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.profileIcon}
            >
              <FontAwesome5 name="key" size={24} color="#FFF" />
            </LinearGradient>
            <Text style={styles.profileHeaderText}>Forgot Password</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>
                  <GradientText text={<Ionicons name="mail-outline" size={20} color="#6C63FF" />} size={20} />
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your registered email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSendOtp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#56235E', '#C1392D']}
              locations={[0.2081, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={20} color="#FFF" style={styles.buttonIcon} />
                  <Text style={styles.saveButtonText}>Send OTP</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    }),
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;