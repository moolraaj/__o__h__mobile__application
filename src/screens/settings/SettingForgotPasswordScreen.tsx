import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useResetPasswordMutation } from '../../store/services/user/userApi';
import { Layout } from '../../common/Layout';
import { ToastMessage } from '../../resuable/Toast';
import { useRoute } from '@react-navigation/native';

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
        const newErrors = {
            otp: '',
            newPassword: '',
            confirmPassword: ''
        };
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
            // Handle specific error cases
            if (err.data?.error === "Invalid OTP.") {
                setErrors(prev => ({ ...prev, otp: 'Invalid OTP' }));
            } else if (err.data?.error === "OTP has expired.") {
                setErrors(prev => ({ ...prev, otp: 'OTP has expired' }));
            }
            ToastMessage('error', err.data?.error || 'Failed to reset password');
        }
    };

    return (
        <Layout>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.select({ ios: 'padding', android: undefined })}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Text style={styles.title}>Verify OTP & Reset Password</Text>
                    <Text style={styles.subText}>Email: {email}</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>OTP</Text>
                        <TextInput
                            style={[styles.input, errors.otp && styles.errorInput]}
                            keyboardType="numeric"
                            placeholder="Enter the OTP"
                            value={otp}
                            onChangeText={(text) => {
                                setOtp(text);
                                setErrors(prev => ({ ...prev, otp: '' }));
                            }}
                        />
                        {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            style={[styles.input, errors.newPassword && styles.errorInput]}
                            placeholder="New password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                setErrors(prev => ({ ...prev, newPassword: '' }));
                            }}
                        />
                        {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={[styles.input, errors.confirmPassword && styles.errorInput]}
                            placeholder="Confirm password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                        />
                        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.disabled]}
                        onPress={handleReset}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Resetting…' : 'Reset Password'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
};

const styles = StyleSheet.create({
     errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    container: { flex: 1, padding: 16 },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#80225E',
        textAlign: 'center',
        marginBottom: 8,
    },
    subText: { textAlign: 'center', color: '#555', marginBottom: 24 },
    inputContainer: { marginBottom: 16 },
    label: { color: '#80225E', marginBottom: 6 },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#80225E',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    disabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});