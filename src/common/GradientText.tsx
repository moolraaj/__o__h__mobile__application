import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTextProps {
    text: any;
    size?: number;
}

export default function GradientText({ text, size }: GradientTextProps) {
    return (
        <MaskedView
            maskElement={
                <Text style={[styles.maskedText, { fontSize: size, color: '#56235E' }]}>
                    {text}
                </Text>
            }
        >
            <LinearGradient
                colors={['#56235E', '#C1392D']}
                locations={[0.2081, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {/* This text is just for layout and keeps the gradient visible */}
                <Text style={[styles.maskedText, { fontSize: size, opacity: 0 }]}>
                    {text}
                </Text>
            </LinearGradient>
        </MaskedView>
    );
}

const styles = StyleSheet.create({
    maskedText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Nutio',
    },
});
