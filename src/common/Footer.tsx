import React from 'react';
import { TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ICON_SIZE } from '../../src/constants/Variables';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../constants/RootStackParamList';

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





















// import React, { useRef, useEffect, useState } from 'react';
// import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { DashboardScreen } from '../screens/DashboardScreen';
// import SettingScreen from '../screens/SettingScreen';
// import SliderDetails from '../screens/SliderDetails';
// import DiseaseScreen from '../screens/DiseaseScreen';


// const Tab = createBottomTabNavigator();

// const TABS = [
//   { name: 'Dashboard', icon: 'speedometer-outline', component: DashboardScreen },
//   { name: 'Settings', icon: 'water-outline', component: SettingScreen },
// ];

// const CustomTabBar = ({ state, navigation }: any) => {
//   const translateX = useRef(new Animated.Value(0)).current;
//   const [tabWidth, setTabWidth] = useState(0);

//   useEffect(() => {
//     Animated.spring(translateX, {
//       toValue: state.index * tabWidth,
//       useNativeDriver: true,
//     }).start();
//   }, [state.index, tabWidth]);

//   return (
//     <View style={styles.wrapper}>
//       <View
//         style={[styles.tabContainer, { backgroundColor: '#fff' }]}
//         onLayout={(event) => {
//           const { width } = event.nativeEvent.layout;
//           setTabWidth(width / TABS.length);
//         }}
//       >
//         {state.routes.map((route: any, index: number) => {
//           const tab = TABS.find((t) => t.name === route.name);
//           const isFocused = state.index === index;

//           if (!tab) return null;

//           return (
//             <TouchableOpacity
//               key={index}
//               style={styles.tab}
//               onPress={() => {
//                 if (!isFocused) {
//                   navigation.navigate(route.name);
//                 }
//               }}
//             >
//               <Animated.View
//                 style={[
//                   styles.iconWrapper,
//                   isFocused && styles.activeIconWrapper,
//                 ]}
//               >
//                 <Icon
//                   name={tab.icon}
//                   size={24}
//                 />
//               </Animated.View>
//               <Text
//                 numberOfLines={1}
//                 ellipsizeMode="tail"
//               >
//                 {tab.name}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}

//         {/* Sliding Indicator */}
//         <Animated.View
//           style={[
//             styles.indicator,
//             {
//               width: tabWidth * 0.6,
//               transform: [{ translateX: Animated.add(translateX, tabWidth * 0.2) }],
//             },
//           ]}
//         />
//       </View>

//     </View>
//   );
// };

// const Footer = () => {
//   return (
//     <Tab.Navigator
//       tabBar={(props) => <CustomTabBar {...props} />}
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       {TABS.map((tab, index) => (
//         <Tab.Screen key={index} name={tab.name} component={tab.component} />
//       ))}

//       {/* Hidden Screens in Stack */}
//       <Tab.Screen
//         name="SliderDetails"
//         component={SliderDetails}
//         options={{ tabBarButton: () => null }}
//       />
//       <Tab.Screen
//         name="Disease"
//         component={DiseaseScreen}
//         options={{ tabBarButton: () => null }}
//       />
//     </Tab.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     zIndex: 9999,
//   },
//   imageBackground: {
//     width: '100%',
//   },
//   tabContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     shadowColor: '#808080',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 20,
//     paddingBottom: 10,
//     marginHorizontal: 10,
//     paddingHorizontal: 5,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   iconWrapper: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//   },
//   activeIconWrapper: {
//     transform: [{ translateY: -18 }],
//     backgroundColor: '#00ADEE',
//   },
//   text: {
//     fontSize: 12,
//     lineHeight: 10,
//   },
//   activeText: {
//     // color: '#00ADEE',
//     fontWeight: '600',
//   },
//   indicator: {
//     position: 'absolute',
//     bottom: 0,
//     height: 4,
//     borderRadius: 10,
//   },
// });

// export default Footer;