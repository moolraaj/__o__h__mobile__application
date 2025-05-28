import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Easing, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../common/GradientText';

type SplashProps = {
    onFinish: () => void;
};

export default function Splash({ onFinish }: SplashProps) {
    const [step, setStep] = useState(1);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const progress = useRef(new Animated.Value(0)).current;

    // Animation sequences
    const runFirstAnimation = () => {
        return new Promise<void>((resolve) => {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.elastic(1),
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
                }),
            ]).start(() => {
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 0.9,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start(() => resolve());
            });
        });
    };

    const runSecondAnimation = () => {
        return new Promise<void>((resolve) => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideUpAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.exp),
                }),
                Animated.timing(progress, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ]).start(() => resolve());
        });
    };

    useEffect(() => {
        const sequence = async () => {
            // Step 1: Animated logo with bounce effect
            await runFirstAnimation();
            setStep(2);

            // Step 2: Full screen gradient with content
            await runSecondAnimation();

            // Small delay before finishing
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            onFinish();
        };

        sequence();
    }, []);

    // Interpolate rotation for the first step
    const rotateInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {step === 1 && (
                <Animated.View style={[
                    styles.step1Container,
                    {
                        transform: [
                            { scale: scaleAnim },
                            { rotate: rotateInterpolation },
                        ],
                    },
                ]}>
                    <Image
                        source={require('../images/splash-logo-primary.png')}
                        style={styles.logoPrimary}
                    />
                </Animated.View>
            )}

            {step === 2 && (
                <LinearGradient
                    colors={['#F7C9FF', '#FFBDB9', '#FFE3B0']}
                    locations={[0.1, 0.5, 0.9]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientContainer}
                >
                    <Animated.View style={[
                        styles.contentContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideUpAnim }],
                        },
                    ]}>
                        <Image
                            source={require('../images/splash-logo-secondary.png')}
                            style={styles.logoSecondary}
                        />

                        <Text style={styles.universityText}>
                            <GradientText
                                text="MS Ramaiah University"
                                size={24}
                                colors={['#6a11cb', '#2575fc']}
                            />
                        </Text>
                        <Text style={styles.subtitleText}>
                            <GradientText
                                text="Of Applied Sciences"
                                size={18}

                                colors={['#6a11cb', '#2575fc']}
                            />
                        </Text>
                        <View style={styles.taglineContainer}>
                            <Text style={styles.taglineText}>Innovation • Excellence • Integrity</Text>
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.progressBarContainer, { opacity: fadeAnim }]}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    })
                                }
                            ]}
                        />
                    </Animated.View>
                </LinearGradient>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
    },
    step1Container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoPrimary: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    gradientContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    contentContainer: {
        alignItems: 'center',
        padding: 20,
        width: '100%',
    },
    logoSecondary: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    universityText: {
        fontWeight: '700',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitleText: {
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
    },
    taglineContainer: {
        marginTop: 30,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    taglineText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 50,
        width: '70%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#6a11cb',
    },
});