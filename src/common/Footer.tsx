import React from 'react';
import { TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ICON_SIZE } from '../../src/constants/Variables';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from './RootStackParamList';

export default function BottomBar({
    homeScreen = 'Dashboard',
    settingsScreen = 'Setting',
    NotificationScreen = 'Notification',
    barHeight = 50,
}) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute();

    const canGoBack = navigation.canGoBack();
    const isRootScreen =
        route.name === homeScreen || route.name === settingsScreen || route.name === NotificationScreen;
    const showBack = canGoBack && !isRootScreen;

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#56235E', '#C1392D']}
                locations={[0.2081, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.bar, { height: barHeight }]}
            >
                {showBack && (
                    <TouchableOpacity onPress={navigation.goBack} style={styles.button}>
                        <FontAwesome5 name="arrow-circle-left" size={ICON_SIZE} color="#fff" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => navigation.navigate(homeScreen as keyof RootStackParamList)}
                    style={styles.button}
                >
                    <Ionicons name="home" size={ICON_SIZE} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate(settingsScreen as keyof RootStackParamList)}
                    style={styles.button}
                >
                    <Ionicons name="settings" size={ICON_SIZE} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { backgroundColor: '#fff' },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ddd',

        // Box shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 50,

        // Box shadow for Android
        elevation: 10,
    },
    button: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});




