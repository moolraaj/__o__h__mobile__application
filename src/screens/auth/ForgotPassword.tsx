import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useForgotPasswordMutation, useGetUsersQuery } from '../../store/services/user/userApi';
import { ToastMessage } from '../../resuable/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GradientText from '../../common/GradientText';


export const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
    const { data: adminData } = useGetUsersQuery({
        page: 1,
        limit: 100,
    });
    console.log('werwer', adminData)
    const [email, setEmail] = useState('');
    const [sendOtp, { isLoading }] = useForgotPasswordMutation();

    const handleSendOtp = async () => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) {
            return ToastMessage('error', 'Please enter your email');
        }

        if (!adminData || !adminData.users) {
            return ToastMessage('error', 'Admin data not loaded yet. Please try again.');
        }

        const adminExists = adminData.users.some(
            admin => admin.email && admin.email.toLowerCase() === trimmedEmail
        );

        if (!adminExists) {
            return ToastMessage('error', 'Email not found in admin accounts');
        }

        try {
            const res = await sendOtp({ email: trimmedEmail }).unwrap();
            ToastMessage('success', res.message);
            navigation.navigate('SettingForgotPasswordScreen', { email: trimmedEmail });
        } catch (err: any) {
            ToastMessage('error', err.data?.error || 'Failed to send OTP');
        }
    };

    return (
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

            <View style={styles.footerLink}>
                <Text style={{ textAlign: 'center' }}>Back to login</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <GradientText text="Login" />
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        flex: 1
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
        margin: 20,
        gap: 5,
    },
    bottomText: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },
});

export default ForgotPasswordScreen;