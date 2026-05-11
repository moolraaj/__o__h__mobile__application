import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalText } from '../constants/GlobalText';

interface GradientTextProps {
    text: any;
    size?: number;
    colors?: string[];
}

export default function GradientText({ text, size = 16, colors }: GradientTextProps) {
    const gradientColors = colors || ['#56235E', '#C1392D'];

    return (
        <MaskedView
            maskElement={
                <GlobalText style={[styles.maskedText, { fontSize: size, color: '#56235E' }]}>
                    {text}
                </GlobalText>
            }
        >
            <LinearGradient
                colors={gradientColors}
                locations={[0.2081, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <GlobalText style={[styles.maskedText, { fontSize: size, opacity: 0 }]}>
                    {text}
                </GlobalText>
            </LinearGradient>
        </MaskedView>
    );
}

const styles = StyleSheet.create({
    maskedText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Nutio',
        textTransform: 'capitalize'
    },
});