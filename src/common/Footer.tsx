import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    View,
    Platform,
} from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../constants/RootStackParamList';
const ICON_SIZE = 24;

export default function BottomBar({
    homeScreen = 'Dashboard',
    settingsScreen = 'Setting',
    AdminScreen = 'Admin',
    UserScreen = 'User',
    barHeight = 50,
}) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute();

    const canGoBack = navigation.canGoBack();
    const showBack =
        canGoBack &&
        route.name !== homeScreen &&
        route.name !== AdminScreen &&
        route.name !== UserScreen;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.wrapper]}>
                <LinearGradient
                    colors={['#5E2D88', '#D9313D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.bar, { height: barHeight }]}
                >
                    {showBack && (
                        <TouchableOpacity
                            onPress={navigation.goBack}
                            style={styles.backButtonContainer}
                            activeOpacity={0.7}
                        >
                            <View style={styles.backButton}>
                                <FontAwesome5 name="arrow-left" size={18} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => navigation.navigate(homeScreen as keyof RootStackParamList)}
                        style={styles.button}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="home-outline" size={ICON_SIZE} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate(settingsScreen as keyof RootStackParamList)}
                        style={styles.button}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings-outline" size={ICON_SIZE} color="#fff" />
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'transparent',
    },
    wrapper: {
        position: 'absolute',
        bottom: 10,
        left: 15,
        right: 15,
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 16,
        paddingHorizontal: 10,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonContainer: {
        position: 'absolute',
        left: 15,
        top: '50%',
        transform: [{ translateY: -16 }],
        zIndex: 10,
    },
    backButton: {
        width: 32,
        height: 32,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
