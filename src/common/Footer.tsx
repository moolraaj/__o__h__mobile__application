import React from 'react';
import { TouchableOpacity, StyleSheet, SafeAreaView, View } from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../constants/RootStackParamList';
import { WHITE } from '../constants/Variables';

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
                                <FontAwesome5 name="arrow-left" size={18} color={WHITE} />
                            </View>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => navigation.navigate(homeScreen as keyof RootStackParamList)}
                        style={styles.button}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="home-outline" size={24} color={WHITE} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate(settingsScreen as keyof RootStackParamList)}
                        style={styles.button}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings-outline" size={24} color={WHITE} />
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
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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

















// import React from 'react';
// import {
//     TouchableOpacity,
//     StyleSheet,
//     SafeAreaView,
//     View,
//     Platform,
// } from 'react-native';

// import {
//     useNavigation,
//     useRoute,
//     NavigationProp,
// } from '@react-navigation/native';

// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import LinearGradient from 'react-native-linear-gradient';

// import { RootStackParamList } from '../constants/RootStackParamList';
// import { WHITE } from '../constants/Variables';

// const ICON_SIZE = 22;

// export default function BottomBar({
//     homeScreen = 'Dashboard',
//     settingsScreen = 'Setting',
//     AdminScreen = 'Admin',
//     UserScreen = 'User',
// }) {
//     const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//     const route = useRoute();

//     const currentRoute = route.name;


//     const menus = [
//         {
//             icon: 'home',
//             outline: 'home-outline',
//             screen: homeScreen,
//         },
//         {
//             icon: 'notifications',
//             outline: 'notifications-outline',
//             screen: 'Notification',
//         },
//         {
//             icon: 'add',
//             outline: 'add',
//             screen: 'Dashboard',
//             isCenter: true,
//         },
//         {
//             icon: 'chatbubble',
//             outline: 'chatbubble-outline',
//             screen: 'Chat',
//         },
//         {
//             icon: 'settings',
//             outline: 'settings-outline',
//             screen: settingsScreen,
//         },
//     ];

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View style={styles.wrapper}>
//                 <LinearGradient
//                     colors={['rgba(94,45,136,0.95)', 'rgba(217,49,61,0.95)']}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.bar}
//                 >

//                     {menus.map((item, index) => {
//                         const isActive = currentRoute === item.screen;

//                         if (item.isCenter) {
//                             return (
//                                 <TouchableOpacity
//                                     key={index}
//                                     activeOpacity={0.8}
//                                     onPress={() =>
//                                         navigation.navigate(
//                                             item.screen as keyof RootStackParamList
//                                         )
//                                     }
//                                     style={styles.centerButtonWrapper}
//                                 >
//                                     <LinearGradient
//                                         colors={['#FFFFFF', '#F3F3F3']}
//                                         style={styles.centerButton}
//                                     >
//                                         <Ionicons
//                                             name={item.icon as any}
//                                             size={28}
//                                             color="#D9313D"
//                                         />
//                                     </LinearGradient>
//                                 </TouchableOpacity>
//                             );
//                         }

//                         return (
//                             <TouchableOpacity
//                                 key={index}
//                                 activeOpacity={0.7}
//                                 onPress={() =>
//                                     navigation.navigate(
//                                         item.screen as keyof RootStackParamList
//                                     )
//                                 }
//                                 style={styles.menuButton}
//                             >
//                                 <View
//                                     style={[
//                                         styles.iconWrapper,
//                                         isActive && styles.activeIconWrapper,
//                                     ]}
//                                 >
//                                     <Ionicons
//                                         name={
//                                             (isActive ? item.icon : item.outline) as any
//                                         }
//                                         size={ICON_SIZE}
//                                         color={WHITE}
//                                     />
//                                 </View>
//                             </TouchableOpacity>
//                         );
//                     })}
//                 </LinearGradient>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     safeArea: {
//         backgroundColor: 'transparent',
//     },

//     wrapper: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//     },

//     bar: {
//         height: 60,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 10,

//         ...Platform.select({
//             ios: {
//                 shadowColor: '#000',
//                 shadowOffset: {
//                     width: 0,
//                     height: 10,
//                 },
//                 shadowOpacity: 0.15,
//                 shadowRadius: 15,
//             },

//             android: {
//                 elevation: 12,
//             },
//         }),
//     },

//     menuButton: {
//         flex: 1,
//         alignItems: 'center',
//     },

//     iconWrapper: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,

//         alignItems: 'center',
//         justifyContent: 'center',
//     },

//     activeIconWrapper: {
//         backgroundColor: 'rgba(255,255,255,0.18)',
//     },

//     centerButtonWrapper: {
//         position: 'relative',
//     },

//     centerButton: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,

//         alignItems: 'center',
//         justifyContent: 'center',

//     },
// });