import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastMessage } from '../../resuable/Toast';
import { useAuth } from '../../navigation/AuthContext';
import { useLoginUserMutation } from '../../store/services/user/userApi';

interface SuccessModalProps {
    visible: boolean;
    message: string;
    onClose: () => void;
    phoneNumber: string;
    callingCode: any;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    message,
    onClose,
    phoneNumber,
    callingCode,
}) => {
    const { setToken, setUser } = useAuth();
    const [loginUser, { isLoading: loggingIn }] = useLoginUserMutation();

    const handleModalContinue = async () => {
        try {
            const loginRes = await loginUser({ phoneNumber: `+${callingCode}${phoneNumber}` }).unwrap();
            await AsyncStorage.multiSet([
                ['authToken', loginRes.token],
                ['user', JSON.stringify(loginRes.user)],
            ]);
            setToken(loginRes.token);
            setUser(loginRes.user);
            onClose();
            ToastMessage('success', loginRes.message || 'Logged in successfully');
        } catch (err: any) {
            onClose();
            ToastMessage('error', err?.data?.error || 'Login failed');
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <LinearGradient
                        colors={['#56235E', '#C1392D']}
                        locations={[0.2081, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.iconCircle}
                    >
                        <Feather name="check" size={30} color="#fff" />
                    </LinearGradient>

                    <Text style={styles.title}>Success</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        onPress={handleModalContinue}
                        style={{ width: '100%' }}
                        disabled={loggingIn}
                    >
                        <LinearGradient
                            colors={['#56235E', '#C1392D']}
                            locations={[0.2081, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            {loggingIn ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Continue Login</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SuccessModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#000',
    },
    message: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginBottom: 25,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
