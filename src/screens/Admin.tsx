import { Slider } from "../components/Slider";
import { Layout } from "../common/Layout";
import FeaturesScreen from "./FeaturesScreen";
import { API_BASE_URL } from '@env';
import '../i18n'
import TextSliderScreen from "./TextSliderScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { View } from "react-native";


const Admin = ({ navigation }: any) => {
  console.log(API_BASE_URL)
  useEffect(() => {
    (async () => {
      console.log('JWT from storage →', await AsyncStorage.getItem('authToken'));
    })();
  }, []);
  return (
    <>
      <Layout>
        <Slider/>
        <FeaturesScreen navigation={navigation} />
        <TextSliderScreen/>
      </Layout>
    </>
  )
}

export default Admin