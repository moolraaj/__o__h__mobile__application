import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientButtonProps {
    label: string;
    onPress?: (event: GestureResponderEvent) => void;
}

const GradientButton: React.FC<GradientButtonProps> = ({ label, onPress = () => { } }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={['#56235E', '#C1392D']}
                locations={[0.2081, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}

            >
                <Text style={styles.buttonText}>{label}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 500,
        fontFamily: 'Nutio',
        textTransform: 'capitalize'
    },
});

export default GradientButton;
