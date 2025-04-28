import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
const siteLogo = require('../images/danta-logo.png');

export default function Loader() {
    const scale1 = useRef(new Animated.Value(0)).current;
    const scale2 = useRef(new Animated.Value(0)).current;
    const scale3 = useRef(new Animated.Value(0)).current;

    const animate = (animatedValue: Animated.Value, delay: number) => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        animate(scale1, 0);
        animate(scale2, 500);
        animate(scale3, 1000);
    }, []);

    const ringStyle = (scale: Animated.Value, color: string) => ({
        ...styles.ring,
        borderColor: color,
        transform: [{
            scale: scale.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 2.5],
            })
        }],
        opacity: scale.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        }),
    });

    return (
        <View style={styles.container}>
            <View style={styles.loader}>
                <Animated.View style={ringStyle(scale1, 'rgba(86, 35, 94, 0.4)')} />
                <Animated.View style={ringStyle(scale2, 'rgba(193, 57, 45, 0.4)')} />
                <Animated.View style={ringStyle(scale3, 'rgba(86, 35, 94, 0.2)')} />
                <View style={styles.logoWrapper}>
                    <Image source={siteLogo} style={styles.logo} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        zIndex: 9999,
    },
    loader: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrapper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 30,
        height: 30,
        transform: [{ translateX: -15 }, { translateY: -15 }],
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    logo: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    ring: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 40,
        height: 40,
        marginLeft: -20,
        marginTop: -20,
        borderRadius: 20,
        borderWidth: 2,
    },
});
