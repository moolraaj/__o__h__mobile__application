import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../navigation/AuthContext';
import { useUpdateUserMutation, useGetSingleUserQuery } from '../../store/services/user/userApi';
import { Layout } from '../../common/Layout';
import { ToastMessage } from '../../resuable/Toast';
import bcrypt from 'react-native-bcrypt';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GradientText from '../../common/GradientText';
import { GlobalText } from '../../constants/GlobalText';

const UpdatePasswordScreen = ({ navigation }: { navigation: any }) => {
    const { user } = useAuth();
    const userId = user?.id;

    const { data: userData } = useGetSingleUserQuery(userId);
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        if (userData) {
            setCurrentUser(userData.user);
        }
    }, [userData]);

    const handleChange = (name: string, value: string) => {
        setPasswords(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateCurrentPassword = async () => {
        if (!currentUser?.password) return false;
        return bcrypt.compareSync(passwords.oldPassword, currentUser.password);
    };

    const validateForm = async () => {
        let valid = true;
        const newErrors = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        if (!passwords.oldPassword) {
            newErrors.oldPassword = 'Current password is required';
            valid = false;
        } else {
            const isPasswordValid = await validateCurrentPassword();
            if (!isPasswordValid) {
                newErrors.oldPassword = 'Incorrect current password';
                valid = false;
            }
        }

        if (!passwords.newPassword) {
            newErrors.newPassword = 'New password is required';
            valid = false;
        } else if (passwords.newPassword.length < 4) {
            newErrors.newPassword = 'Password must be at least 4 characters';
            valid = false;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (!isValid) return;

        try {
            await updateUser({
                userId,
                userData: {
                    oldPassword: passwords.oldPassword,
                    password: passwords.newPassword
                }
            }).unwrap();

            ToastMessage('success', 'Password updated successfully');
            navigation.goBack();
        } catch (error: any) {
            ToastMessage('error', 'Failed to update password');
            if (error.data?.message?.includes('current password')) {
                setErrors(prev => ({ ...prev, oldPassword: 'Incorrect password' }));
            }
        }
    };

    return (
        <Layout>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
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
                    <GlobalText style={styles.profileHeaderText}>Update Your Password</GlobalText>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <GlobalText style={styles.label}>Current Password</GlobalText>
                        <View style={[styles.inputWrapper, errors.oldPassword ? styles.errorWrapper : null]}>
                            <GlobalText style={styles.inputIcon}>
                                <GradientText text={<Ionicons name="lock-closed-outline" size={20} color="#6C63FF" />} size={20} />
                            </GlobalText>
                            <TextInput
                                style={styles.input}
                                value={passwords.oldPassword}
                                onChangeText={(text) => handleChange('oldPassword', text)}
                                placeholder="Enter current password"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                        </View>
                        {errors.oldPassword ? (
                            <GlobalText style={styles.errorText}>{errors.oldPassword}</GlobalText>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <GlobalText style={styles.label}>New Password</GlobalText>
                        <View style={[styles.inputWrapper, errors.newPassword ? styles.errorWrapper : null]}>
                            <GlobalText style={styles.inputIcon}>
                                <GradientText text={<Ionicons name="lock-open-outline" size={20} color="#6C63FF" />} size={20} />
                            </GlobalText>
                            <TextInput
                                style={styles.input}
                                value={passwords.newPassword}
                                onChangeText={(text) => handleChange('newPassword', text)}
                                placeholder="Enter new password"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                        </View>
                        {errors.newPassword ? (
                            <GlobalText style={styles.errorText}>{errors.newPassword}</GlobalText>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <GlobalText style={styles.label}>Confirm New Password</GlobalText>
                        <View style={[styles.inputWrapper, errors.confirmPassword ? styles.errorWrapper : null]}>
                            <GlobalText style={styles.inputIcon}>
                                <GradientText text={<Ionicons name="lock-open-outline" size={20} color="#6C63FF" />} size={20} />
                            </GlobalText>
                            <TextInput
                                style={styles.input}
                                value={passwords.confirmPassword}
                                onChangeText={(text) => handleChange('confirmPassword', text)}
                                placeholder="Confirm new password"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                        </View>
                        {errors.confirmPassword ? (
                            <GlobalText style={styles.errorText}>{errors.confirmPassword}</GlobalText>
                        ) : null}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSubmit}
                    disabled={isUpdating}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#56235E', '#C1392D']}
                        locations={[0.2081, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="save-outline" size={20} color="#FFF" style={styles.buttonIcon} />
                                <GlobalText style={styles.saveButtonText}>Update Password</GlobalText>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SettingForgotPassword')}>
                    <GlobalText style={styles.forgotText}>Forgot your password?</GlobalText>
                </TouchableOpacity>
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
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
        position: 'relative',
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
    errorWrapper: {
        borderColor: '#FF3B30',
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
    errorText: {
        position: 'absolute',
        bottom: -16,
        color: '#FF3B30',
        fontSize: 10,
        marginTop: 4,
        marginLeft: 12,
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
    forgotText: {
        color: '#80225E',
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});

export default UpdatePasswordScreen;