// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     KeyboardAvoidingView,
//     Platform,
// } from 'react-native';
// import { useResetPasswordMutation } from '../../store/services/user/userApi';
// import { Layout } from '../../common/Layout';
// import { ToastMessage } from '../../resuable/Toast';
// import { useRoute } from '@react-navigation/native';

// export const SettingForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
//     const { email } = useRoute().params as { email: string };
//     const [otp, setOtp] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [errors, setErrors] = useState({
//         otp: '',
//         newPassword: '',
//         confirmPassword: ''
//     });
//     const [resetPwd, { isLoading }] = useResetPasswordMutation();

//     const validateInputs = () => {
//         const newErrors = {
//             otp: '',
//             newPassword: '',
//             confirmPassword: ''
//         };
//         let isValid = true;

//         if (!otp) {
//             newErrors.otp = 'OTP is required';
//             isValid = false;
//         }

//         if (!newPassword) {
//             newErrors.newPassword = 'Password is required';
//             isValid = false;
//         } else if (newPassword.length < 6) {
//             newErrors.newPassword = 'Password must be at least 6 characters';
//             isValid = false;
//         }

//         if (!confirmPassword) {
//             newErrors.confirmPassword = 'Please confirm your password';
//             isValid = false;
//         } else if (newPassword !== confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//             isValid = false;
//         }

//         setErrors(newErrors);
//         return isValid;
//     };

//     const handleReset = async () => {
//         if (!validateInputs()) return;

//         try {
//             const res = await resetPwd({ otp, newPassword, confirmPassword }).unwrap();
//             ToastMessage('success', res.message);
//             navigation.navigate('Setting');
//         } catch (err: any) {
//             // Handle specific error cases
//             if (err.data?.error === "Invalid OTP.") {
//                 setErrors(prev => ({ ...prev, otp: 'Invalid OTP' }));
//             } else if (err.data?.error === "OTP has expired.") {
//                 setErrors(prev => ({ ...prev, otp: 'OTP has expired' }));
//             }
//             ToastMessage('error', err.data?.error || 'Failed to reset password');
//         }
//     };

//     return (
//         <Layout>
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
//                 <Text style={styles.title}>Verify OTP & Reset Password</Text>
//                 <Text style={styles.subText}>Email: {email}</Text>

//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>OTP</Text>
//                     <TextInput
//                         style={[styles.input, errors.otp && styles.errorInput]}
//                         keyboardType="numeric"
//                         placeholder="Enter the OTP"
//                         value={otp}
//                         onChangeText={(text) => {
//                             setOtp(text);
//                             setErrors(prev => ({ ...prev, otp: '' }));
//                         }}
//                     />
//                     {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
//                 </View>

//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>New Password</Text>
//                     <TextInput
//                         style={[styles.input, errors.newPassword && styles.errorInput]}
//                         placeholder="New password"
//                         secureTextEntry
//                         value={newPassword}
//                         onChangeText={(text) => {
//                             setNewPassword(text);
//                             setErrors(prev => ({ ...prev, newPassword: '' }));
//                         }}
//                     />
//                     {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
//                 </View>

//                 <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Confirm Password</Text>
//                     <TextInput
//                         style={[styles.input, errors.confirmPassword && styles.errorInput]}
//                         placeholder="Confirm password"
//                         secureTextEntry
//                         value={confirmPassword}
//                         onChangeText={(text) => {
//                             setConfirmPassword(text);
//                             setErrors(prev => ({ ...prev, confirmPassword: '' }));
//                         }}
//                     />
//                     {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
//                 </View>

//                 <TouchableOpacity
//                     style={[styles.button, isLoading && styles.disabled]}
//                     onPress={handleReset}
//                     disabled={isLoading}
//                 >
//                     <Text style={styles.buttonText}>
//                         {isLoading ? 'Resetting…' : 'Reset Password'}
//                     </Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         </Layout>
//     );
// };

// const styles = StyleSheet.create({
//     errorInput: {
//         borderColor: 'red',
//     },
//     errorText: {
//         color: 'red',
//         fontSize: 12,
//         marginTop: 4,
//     },
//     container: { flex: 1, padding: 16 },
//     title: {
//         fontSize: 24,
//         fontWeight: '600',
//         color: '#80225E',
//         textAlign: 'center',
//         marginBottom: 8,
//     },
//     subText: { textAlign: 'center', color: '#555', marginBottom: 24 },
//     inputContainer: { marginBottom: 16 },
//     label: { color: '#80225E', marginBottom: 6 },
//     input: {
//         height: 48,
//         borderWidth: 1,
//         borderColor: '#e0e0e0',
//         borderRadius: 8,
//         paddingHorizontal: 12,
//         backgroundColor: '#fff',
//     },
//     button: {
//         backgroundColor: '#80225E',
//         paddingVertical: 14,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     disabled: { opacity: 0.6 },
//     buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
// });

























import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useResetPasswordMutation } from '../../store/services/user/userApi';
import { Layout } from '../../common/Layout';
import { ToastMessage } from '../../resuable/Toast';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GradientText from '../../common/GradientText';

export const SettingForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
    const { email } = useRoute().params as { email: string };
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [resetPwd, { isLoading }] = useResetPasswordMutation();

    const validateInputs = () => {
        const newErrors = { otp: '', newPassword: '', confirmPassword: '' };
        let isValid = true;

        if (!otp) {
            newErrors.otp = 'OTP is required';
            isValid = false;
        }

        if (!newPassword) {
            newErrors.newPassword = 'Password is required';
            isValid = false;
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleReset = async () => {
        if (!validateInputs()) return;

        try {
            const res = await resetPwd({ otp, newPassword, confirmPassword }).unwrap();
            ToastMessage('success', res.message);
            navigation.navigate('Setting');
        } catch (err: any) {
            if (err.data?.error === 'Invalid OTP.') {
                setErrors(prev => ({ ...prev, otp: 'Invalid OTP' }));
            } else if (err.data?.error === 'OTP has expired.') {
                setErrors(prev => ({ ...prev, otp: 'OTP has expired' }));
            }
            ToastMessage('error', err.data?.error || 'Failed to reset password');
        }
    };

    return (
        <Layout>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileHeader}>
                    <LinearGradient
                        colors={['#56235E', '#C1392D']}
                        style={styles.profileIcon}
                    >
                        <FontAwesome5 name="shield-alt" size={24} color="#FFF" />
                    </LinearGradient>
                    <Text style={styles.profileHeaderText}>Reset Your Password</Text>
                    <Text style={styles.emailText}>Email: {email}</Text>
                </View>

                {/* OTP Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>OTP</Text>
                    <View style={[styles.inputWrapper, errors.otp && styles.errorWrapper]}>
                        <Text style={styles.inputIcon} >
                            <GradientText text={<Ionicons name="keypad-outline" size={20} color="#6C63FF" />} size={20} />
                        </Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Enter OTP"
                            value={otp}
                            onChangeText={(text) => {
                                setOtp(text);
                                setErrors(prev => ({ ...prev, otp: '' }));
                            }}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
                </View>

                {/* New Password Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={[styles.inputWrapper, errors.newPassword && styles.errorWrapper]}>
                        <Text style={styles.inputIcon} >
                            <GradientText text={<Ionicons name="lock-open-outline" size={20} color="#6C63FF" />} size={20} />
                        </Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                setErrors(prev => ({ ...prev, newPassword: '' }));
                            }}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={[styles.inputWrapper, errors.confirmPassword && styles.errorWrapper]}>
                        <Text style={styles.inputIcon} >
                            <GradientText text={<Ionicons name="lock-closed-outline" size={20} color="#6C63FF" />} size={20} />
                        </Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleReset}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#56235E', '#C1392D']}
                        style={styles.gradientButton}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="refresh-outline" size={20} color="#FFF" style={styles.buttonIcon} />
                                <Text style={styles.saveButtonText}>Reset Password</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 20,
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
    emailText: {
        color: '#777',
        fontSize: 13,
        marginTop: 4,
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
        position: 'relative',
    },
    errorWrapper: {
        borderColor: '#FF3B30',
    },
    inputIcon: {
        marginLeft: 12,
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 12,
        position: 'absolute',
        bottom: -16,
        left: 0,
    },
    saveButton: {
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        overflow: 'hidden',
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

export default SettingForgotPasswordScreen;
