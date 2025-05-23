import React from 'react'
import { View, StyleSheet } from 'react-native'
import Features from '../components/Features'
import HabitHealthDisease from '../components/home/HabitHealth'
import GradientText from '../common/GradientText'



const FeaturesScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10, alignItems: 'flex-start' }}>
        <GradientText text="Features" size={22} />
      </View>
       

      <View style={styles.colRight}>
         <Features navigation={navigation} />
         <Features navigation={navigation} />
        <HabitHealthDisease navigation={navigation} />
      </View>
    </View>
  )
}

export default FeaturesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  colLeft: {
    flex: 2,
    marginRight: 20,
  },
  colRight: {
    flex: 2,
  },
})
