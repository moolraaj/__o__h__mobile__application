// components/AppError.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export const AppError = ({ onRetry }: { onRetry?: () => void }) => {
    return (
        <TouchableOpacity
            style={styles.errorCard}
            onPress={onRetry}
            activeOpacity={0.8}
            disabled={!onRetry}
        >
            <Icon name="alert-circle" size={40} color="#616161" style={styles.icon} />
            <Text style={styles.title}>Something Went Wrong</Text>
            <Text style={styles.message}>
                We encountered an unexpected issue. Please try again later.
            </Text>
            {onRetry && (
                <View style={styles.retryContainer}>
                    <Text style={styles.retryHint}>Tap anywhere to retry</Text>
                    <Icon name="refresh-cw" size={16} color="#616161" style={styles.retryIcon} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    errorCard: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    icon: {
        marginBottom: 20,
        opacity: 0.8,
    },
    title: {
        color: '#424242',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    message: {
        color: '#616161',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 16,
    },
    retryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    retryHint: {
        color: '#616161',
        fontSize: 14,
        marginRight: 6,
    },
    retryIcon: {
        opacity: 0.8,
    },
});
