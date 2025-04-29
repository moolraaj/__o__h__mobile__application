
import { Slider } from "../components/Slider";
import { Layout } from "../common/Layout";
import FeaturesScreen from "./FeaturesScreen";
import { API_BASE_URL } from '@env';
import '../i18n'
import TextSliderScreen from "./TextSliderScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { ScrollView, View} from "react-native";
import Searchbar from "../common/Searchbar";

export const DashboardScreen = ({ navigation }: { navigation: any }) => {


  console.log(API_BASE_URL)
  React.useEffect(() => {
    (async () => {
      console.log('JWT from storage →', await AsyncStorage.getItem('authToken'));
    })();
  }, []);


  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginBottom: 18, marginTop: 2}}><Searchbar /></View>
        <Slider navigation={navigation} />
        <FeaturesScreen navigation={navigation} />
        <TextSliderScreen navigation={navigation} />
      </ScrollView>
    </Layout>
  );
};