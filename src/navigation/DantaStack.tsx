import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SliderDetails from '../screens/SliderDetails';
import FeaturesScreen from '../screens/FeaturesScreen';
import FeatureDetail from '../screens/FeatureDetail';

import { DashboardScreen } from '../screens/DashboardScreen';
import HabitHealthDetails from '../screens/HabitHealthDetailsScreen';
import SettingScreen from '../screens/SettingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CreateLesionScreen from '../screens/lesion/CreateLesionScreen';
import AllLesionsScreen from '../screens/lesion/AllLesionsScreen';
import LesionDetailScreen from '../screens/lesion/LesionDetailScreen';
import LesionUpdateScreen from '../screens/lesion/LesionUpdateScreen';
import CreateQuestionnaire from '../screens/Questionnaire/QuestionnaireCreateScreen';
import QuestionnaireRecords from '../screens/Questionnaire/AllQuestionnaireScreen';
import UpdateQuestionnaireScreen from '../screens/Questionnaire/UpdateQuestionnaireScreen';
import SingleDiseaseScreen from '../screens/SingleDiseaseScreen';
import DentalEmergencyScreen from '../screens/DentalEmergencyScreen';
import DentalEmergencyDetail from '../screens/SingleDentalEmergency';
import RecievedQuestionaryScreen from '../screens/Questionnaire/RecievedQuestionaryScreen';
import MythFactScreen from '../screens/MythFactScreen';
import EditUserScreen from '../screens/settings/EditUserScreen';
import UpdatePasswordScreen from '../screens/settings/ChangePassword';
import { ForgotPasswordScreen } from '../screens/settings/ForgotPasswordScreen';
import { SettingForgotPasswordScreen } from '../screens/settings/SettingForgotPasswordScreen';
import FaqsScreen from '../screens/FaqsScreen';
import TermConditionScreen from '../screens/TermConditionScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator();
export const DantaStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="SliderDetails" component={SliderDetails} />
    <Stack.Screen name="Features" component={FeaturesScreen} />
    <Stack.Screen name="MythsAndFacts" component={MythFactScreen} />
    <Stack.Screen name="FeatureDetail" component={FeatureDetail} />
    <Stack.Screen name="HabitHealthDetail" component={HabitHealthDetails} />

    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Notification" component={NotificationScreen} />
    <Stack.Screen name="CreateLesion" component={CreateLesionScreen} />
    <Stack.Screen name="AllLesions" component={AllLesionsScreen} />
    <Stack.Screen name="SingleLesionRecord" component={LesionDetailScreen} />
    <Stack.Screen name="UpdateLesionRecord" component={LesionUpdateScreen} />
    <Stack.Screen name="CreateQuestionnaire" component={CreateQuestionnaire} />
    <Stack.Screen name="AllQuestionnaire" component={QuestionnaireRecords} />
    <Stack.Screen name="UpdateQuestionnaire" component={UpdateQuestionnaireScreen} />
    <Stack.Screen name="SingleDisease" component={SingleDiseaseScreen} />
    <Stack.Screen name="DentalEmergency" component={DentalEmergencyScreen} />
    <Stack.Screen name="DentalEmergencyDetails" component={DentalEmergencyDetail} />
    <Stack.Screen name="FeedbackReceivedToDanta" component={RecievedQuestionaryScreen} />
    <Stack.Screen name="Setting" component={SettingScreen} />
    <Stack.Screen name="SettingUpdateUser" component={EditUserScreen} />
    <Stack.Screen name="SettingChangePassword" component={UpdatePasswordScreen} />
    <Stack.Screen name="SettingForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="SettingForgotPasswordScreen" component={SettingForgotPasswordScreen} />
    <Stack.Screen name="FaqsScreen" component={FaqsScreen} />
    <Stack.Screen name="TermConditionScreen" component={TermConditionScreen} />
    <Stack.Screen name="PrivacypoliciesScreen" component={PrivacyPolicyScreen} />

  </Stack.Navigator>
);