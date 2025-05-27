import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingScreen from '../screens/SettingScreen';
import SliderDetails from '../screens/SliderDetails';
import FeaturesScreen from '../screens/FeaturesScreen';
import FeatureDetail from '../screens/FeatureDetail';
import { DashboardScreen } from '../screens/DashboardScreen';
import HabitHealthDetails from '../screens/HabitHealthDetailsScreen';
import EditUserScreen from '../screens/settings/EditUserScreen';
import UpdatePasswordScreen from '../screens/settings/ChangePassword';
import { ForgotPasswordScreen } from '../screens/settings/ForgotPasswordScreen';
const Stack = createNativeStackNavigator();
export const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="SliderDetails" component={SliderDetails} />
    <Stack.Screen name="Features" component={FeaturesScreen} />
    <Stack.Screen name="FeatureDetail" component={FeatureDetail} />
    <Stack.Screen name="HabitHealthDetail" component={HabitHealthDetails} />
    <Stack.Screen name="Setting" component={SettingScreen} />
    <Stack.Screen name="SettingUpdateUser" component={EditUserScreen} />
    <Stack.Screen name="SettingChangePassword" component={UpdatePasswordScreen} />
    <Stack.Screen name="SettingForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);