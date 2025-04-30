import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SliderDetails from '../screens/SliderDetails';
import FeaturesScreen from '../screens/FeaturesScreen';
import FeatureDetail from '../screens/FeatureDetail';
import DiseaseScreen from '../screens/DiseaseScreen';
import HabitHealthDetails from '../screens/HabitHealthDetailsScreen';
import Admin from '../screens/Admin';
import SettingScreen from '../screens/SettingScreen';
import LesionsReceived from '../screens/LesionsReceived';
import QuestionReceived from '../screens/QuestionReceived';

const Stack = createNativeStackNavigator();
export const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Admin" component={Admin} />
    <Stack.Screen name="LesionsReceived" component={LesionsReceived} />
    <Stack.Screen name="QuestionReceived" component={QuestionReceived} />
    <Stack.Screen name="SliderDetails" component={SliderDetails} />
    <Stack.Screen name="Features" component={FeaturesScreen} />
    <Stack.Screen name="FeatureDetail" component={FeatureDetail} />
    <Stack.Screen name="Disease" component={DiseaseScreen} />
    <Stack.Screen name="HabitHealthDetail" component={HabitHealthDetails} />
    <Stack.Screen name="Setting" component={SettingScreen} />

  </Stack.Navigator>
);