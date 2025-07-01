import React from 'react'
import { View, StyleSheet } from 'react-native'
import Features from '../components/Features'
import GradientText from '../common/GradientText'
import DentalEmergencyScreen from './DentalEmergencyScreen'
import HabitHealthDisease from '../components/home/HabitHealth'



const FeaturesScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View>
      <View style={{ marginBottom: 10, alignItems: 'flex-start' }}>
        <GradientText text="Features" size={22} />
      </View>

      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Features navigation={navigation} />
          <DentalEmergencyScreen navigation={navigation} />
        </View>
        <HabitHealthDisease navigation={navigation} />
      </View>
    </View>
  )
}

export default FeaturesScreen

