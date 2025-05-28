// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     ActivityIndicator
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useAuth } from '../../navigation/AuthContext';
// import { useUpdateUserMutation, useGetSingleUserQuery } from '../../store/services/user/userApi';
// import { Layout } from '../../common/Layout';
// import { ToastMessage } from '../../resuable/Toast';
// import bcrypt from 'react-native-bcrypt';

// const UpdatePasswordScreen = ({ navigation }: { navigation: any }) => {
//     const { user } = useAuth();
//     const userId = user?.id;

//     const { data: userData } = useGetSingleUserQuery(userId);
//     const [updateUser, { isLoading }] = useUpdateUserMutation();

//     const [passwords, setPasswords] = useState({
//         oldPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//     });
//     const [errors, setErrors] = useState({
//         oldPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//     });
//     const [currentUser, setCurrentUser] = useState<any>(null);

//     useEffect(() => {
//         if (userData) {
//             setCurrentUser(userData.user);
//         }
//     }, [userData]);

//     const handleChange = (name: string, value: string) => {
//         setPasswords(prev => ({ ...prev, [name]: value }));
//         if (errors[name as keyof typeof errors]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     const validateCurrentPassword = async () => {
//         if (!currentUser?.password) return false;
//         return bcrypt.compareSync(passwords.oldPassword, currentUser.password);
//     };

//     const validateForm = async () => {
//         let valid = true;
//         const newErrors = {
//             oldPassword: '',
//             newPassword: '',
//             confirmPassword: ''
//         };

//         if (!passwords.oldPassword) {
//             newErrors.oldPassword = 'Current password is required';
//             valid = false;
//         } else {
//             const isPasswordValid = await validateCurrentPassword();
//             if (!isPasswordValid) {
//                 newErrors.oldPassword = 'Incorrect current password';
//                 valid = false;
//             }
//         }

//         if (!passwords.newPassword) {
//             newErrors.newPassword = 'New password is required';
//             valid = false;
//         } else if (passwords.newPassword.length < 4) {
//             newErrors.newPassword = 'Password must be at least 4 characters';
//             valid = false;
//         }

//         if (passwords.newPassword !== passwords.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//             valid = false;
//         }

//         setErrors(newErrors);
//         return valid;
//     };

//     const handleSubmit = async () => {
//         const isValid = await validateForm();
//         if (!isValid) return;

//         try {
//             await updateUser({
//                 userId,
//                 userData: {
//                     oldPassword: passwords.oldPassword,
//                     password: passwords.newPassword
//                 }
//             }).unwrap();

//             ToastMessage('success', 'Password updated successfully');
//             navigation.goBack();
//         } catch (error: any) {
//             ToastMessage('error', 'Failed to update password');
//             if (error.data?.message?.includes('current password')) {
//                 setErrors(prev => ({ ...prev, oldPassword: 'Incorrect password' }));
//             }
//         }
//     };

//     return (
//         <Layout>
//             <ScrollView style={styles.container}>
//                 <View style={styles.header}>
//                     <Text style={styles.title}>Change Password</Text>
//                     <View style={{ width: 24 }} />
//                 </View>

//                 <LinearGradient
//                     colors={['#F8E4FF', '#FFD7D8']}
//                     locations={[0.2081, 1]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={styles.formContainer}
//                 >
//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Current Password</Text>
//                         <TextInput
//                             style={[styles.input, errors.oldPassword ? styles.errorInput : null]}
//                             value={passwords.oldPassword}
//                             onChangeText={(text) => handleChange('oldPassword', text)}
//                             placeholder="Enter current password"
//                             secureTextEntry
//                         />
//                         {errors.oldPassword ? (
//                             <Text style={styles.errorText}>{errors.oldPassword}</Text>
//                         ) : null}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>New Password</Text>
//                         <TextInput
//                             style={[styles.input, errors.newPassword ? styles.errorInput : null]}
//                             value={passwords.newPassword}
//                             onChangeText={(text) => handleChange('newPassword', text)}
//                             placeholder="Enter new password"
//                             secureTextEntry
//                         />
//                         {errors.newPassword ? (
//                             <Text style={styles.errorText}>{errors.newPassword}</Text>
//                         ) : null}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Confirm New Password</Text>
//                         <TextInput
//                             style={[styles.input, errors.confirmPassword ? styles.errorInput : null]}
//                             value={passwords.confirmPassword}
//                             onChangeText={(text) => handleChange('confirmPassword', text)}
//                             placeholder="Confirm new password"
//                             secureTextEntry
//                         />
//                         {errors.confirmPassword ? (
//                             <Text style={styles.errorText}>{errors.confirmPassword}</Text>
//                         ) : null}
//                     </View>
//                 </LinearGradient>

//                 <TouchableOpacity
//                     style={[styles.saveButton]}
//                     onPress={handleSubmit}
//                 >
//                     {isLoading ? (
//                         <View style={styles.loadingContainer}>
//                             <ActivityIndicator size="small" color="#fff" />
//                             <Text style={styles.saveButtonText}>Updating...</Text>
//                         </View>
//                     ) : (
//                         <Text style={styles.saveButtonText}>Update Password</Text>
//                     )}
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => navigation.navigate('SettingForgotPassword')}>
//                     <Text style={styles.forgotText}>Forgot your password?</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         </Layout>
//     );
// };

// const styles = StyleSheet.create({
//     forgotText: {
//         color: '#80225E',
//         textAlign: 'center',
//         marginBottom: 16,
//         textDecorationLine: 'underline',
//     },
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f0f0f0',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#80225E',
//     },
//     formContainer: {
//         margin: 16,
//         padding: 20,
//         borderRadius: 12,
//     },
//     inputContainer: {
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 14,
//         color: '#80225E',
//         marginBottom: 8,
//         fontWeight: '500',
//     },
//     input: {
//         height: 50,
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         paddingHorizontal: 16,
//         fontSize: 16,
//         borderWidth: 1,
//         borderColor: '#e0e0e0',
//     },
//     errorInput: {
//         borderColor: '#FF3B30',
//     },
//     errorText: {
//         color: '#FF3B30',
//         fontSize: 12,
//         marginTop: 4,
//     },
//     saveButton: {
//         backgroundColor: '#80225E',
//         borderRadius: 8,
//         height: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginHorizontal: 16,
//         marginTop: 20,
//         marginBottom: 40,
//     },

//     saveButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     loadingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

// export default UpdatePasswordScreen;
















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
                    <Text style={styles.profileHeaderText}>Update Your Password</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={[styles.inputWrapper, errors.oldPassword ? styles.errorWrapper : null]}>
                            <Text style={styles.inputIcon}>
                                <GradientText text={<Ionicons name="lock-closed-outline" size={20} color="#6C63FF" />} size={20} />
                            </Text>
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
                            <Text style={styles.errorText}>{errors.oldPassword}</Text>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={[styles.inputWrapper, errors.newPassword ? styles.errorWrapper : null]}>
                            <Text style={styles.inputIcon}>
                                <GradientText text={<Ionicons name="lock-open-outline" size={20} color="#6C63FF" />} size={20} />
                            </Text>
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
                            <Text style={styles.errorText}>{errors.newPassword}</Text>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={[styles.inputWrapper, errors.confirmPassword ? styles.errorWrapper : null]}>
                            <Text style={styles.inputIcon}>
                                <GradientText text={<Ionicons name="lock-open-outline" size={20} color="#6C63FF" />} size={20} />
                            </Text>
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
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
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
                                <Text style={styles.saveButtonText}>Update Password</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SettingForgotPassword')}>
                    <Text style={styles.forgotText}>Forgot your password?</Text>
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