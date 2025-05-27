import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SliderDetails from '../screens/SliderDetails';
import FeaturesScreen from '../screens/FeaturesScreen';
import FeatureDetail from '../screens/FeatureDetail';

import HabitHealthDetails from '../screens/HabitHealthDetailsScreen';
import Admin from '../screens/Admin';
import SettingScreen from '../screens/SettingScreen';
import MythFactScreen from '../screens/MythFactScreen';
import LesionsReceivedList from '../screens/admin/LessionRecievedScreen';
import QuestionReceivedList from '../screens/admin/QuestionnaireRecievedScreen';
import { QuestionnaireFeedbackScreen } from '../screens/admin/QuestionnaireFeedbackScreen';
import EditUserScreen from '../screens/settings/EditUserScreen';
import UpdatePasswordScreen from '../screens/settings/ChangePassword';
import { ForgotPasswordScreen } from '../screens/settings/ForgotPasswordScreen';
import { SettingForgotPasswordScreen } from '../screens/settings/SettingForgotPasswordScreen';
import SingleDiseaseScreen from '../screens/SingleDiseaseScreen';
import DentalEmergencyScreen from '../screens/DentalEmergencyScreen';
import DentalEmergencyDetail from '../screens/SingleDentalEmergency';

const Stack = createNativeStackNavigator();
export const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Admin" component={Admin} />
    <Stack.Screen name="AdminLesions" component={LesionsReceivedList} />
    <Stack.Screen name="AdminQuestion" component={QuestionReceivedList} />
    <Stack.Screen name="MythsAndFacts" component={MythFactScreen} />
    <Stack.Screen name="SliderDetails" component={SliderDetails} />
    <Stack.Screen name="Features" component={FeaturesScreen} />
    <Stack.Screen name="FeatureDetail" component={FeatureDetail} />
    <Stack.Screen name="SingleDisease" component={SingleDiseaseScreen} />
    <Stack.Screen name="DentalEmergency" component={DentalEmergencyScreen} />
    <Stack.Screen name="DentalEmergencyDetails" component={DentalEmergencyDetail} />
    <Stack.Screen name="HabitHealthDetail" component={HabitHealthDetails} />
    <Stack.Screen name="QuestionnaireFeedback" component={QuestionnaireFeedbackScreen} />
    <Stack.Screen name="Setting" component={SettingScreen} />
    <Stack.Screen name="SettingUpdateUser" component={EditUserScreen} />
    <Stack.Screen name="SettingChangePassword" component={UpdatePasswordScreen} />
    <Stack.Screen name="SettingForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="SettingForgotPasswordScreen" component={SettingForgotPasswordScreen} />



  </Stack.Navigator>
);