import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SliderDetails from '../screens/SliderDetails';
import FeaturesScreen from '../screens/FeaturesScreen';
import FeatureDetail from '../screens/FeatureDetail';

import { DashboardScreen } from '../screens/DashboardScreen';
import HabitHealthDetails from '../screens/HabitHealthDetailsScreen';
import SettingScreen from '../screens/SettingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SingleDiseaseScreen from '../screens/SingleDiseaseScreen';
import DentalEmergencyScreen from '../screens/DentalEmergencyScreen';
import DentalEmergencyDetail from '../screens/SingleDentalEmergency';
import RecievedQuestionaryScreen from '../screens/Questionnaire/RecievedQuestionaryScreen';
import MythFactScreen from '../screens/MythFactScreen';
import EditUserScreen from '../screens/settings/EditUserScreen';
import UpdatePasswordScreen from '../screens/settings/ChangePassword';
import { ForgotPasswordScreen } from '../screens/settings/ForgotPasswordScreen';
import { SettingForgotPasswordScreen } from '../screens/settings/SettingForgotPasswordScreen';

const Stack = createNativeStackNavigator();
export const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="SliderDetails" component={SliderDetails} />
    <Stack.Screen name="Features" component={FeaturesScreen} />
    <Stack.Screen name="MythsAndFacts" component={MythFactScreen} />
    <Stack.Screen name="FeatureDetail" component={FeatureDetail} />
    <Stack.Screen name="HabitHealthDetail" component={HabitHealthDetails} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Notification" component={NotificationScreen} />
    <Stack.Screen name="SingleDisease" component={SingleDiseaseScreen} />
    <Stack.Screen name="DentalEmergency" component={DentalEmergencyScreen} />
    <Stack.Screen name="DentalEmergencyDetails" component={DentalEmergencyDetail} />
    <Stack.Screen name="FeedbackReceivedToDanta" component={RecievedQuestionaryScreen} />
    <Stack.Screen name="Setting" component={SettingScreen} />
    <Stack.Screen name="SettingUpdateUser" component={EditUserScreen} />
    <Stack.Screen name="SettingChangePassword" component={UpdatePasswordScreen} />
    <Stack.Screen name="SettingForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="SettingForgotPasswordScreen" component={SettingForgotPasswordScreen} />
  </Stack.Navigator>
);