import React from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ICON_SIZE } from '../../src/constants/Variables';

export default function BottomBar({
    homeScreen = 'Dashboard',
    settingsScreen = 'Setting',
 
    barHeight = 60,
}) {
    const navigation = useNavigation();
    const route = useRoute();

    const canGoBack = navigation.canGoBack();
    const isRootScreen =
        route.name === homeScreen || route.name === settingsScreen;
    const showBack = canGoBack && !isRootScreen;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.bar, { height: barHeight }]}>
                {showBack && (
                    <TouchableOpacity onPress={navigation.goBack} style={styles.button}>
                        <Ionicons name="chevron-back" size={ICON_SIZE} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => navigation.navigate(homeScreen)}
                    style={styles.button}
                >
                    <Ionicons name="home" size={ICON_SIZE} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate(settingsScreen)}
                    style={styles.button}
                >
                    <Ionicons name="settings" size={ICON_SIZE} />
                </TouchableOpacity>
            </View>
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
        backgroundColor: '#fafafa',
    },
    button: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});

 

 
