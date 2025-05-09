import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SliderDetails from '../screens/SliderDetails';
import FeaturesScreen from '../screens/FeaturesScreen';
import FeatureDetail from '../screens/FeatureDetail';
import DiseaseScreen from '../screens/DiseaseScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import HabitHealthDetails from '../screens/HabitHealthDetailsScreen';
import SettingScreen from '../screens/SettingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
const Stack = createNativeStackNavigator();
export const DantaStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="SliderDetails" component={SliderDetails} />
    <Stack.Screen name="Features" component={FeaturesScreen} />
    <Stack.Screen name="FeatureDetail" component={FeatureDetail} />
    <Stack.Screen name="Disease" component={DiseaseScreen} />
    <Stack.Screen name="HabitHealthDetail" component={HabitHealthDetails} />
    <Stack.Screen name="Setting" component={SettingScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Notification" component={NotificationScreen} />

  </Stack.Navigator>
);