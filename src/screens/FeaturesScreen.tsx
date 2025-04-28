import React from 'react'
import { View, StyleSheet } from 'react-native'
import Features from '../components/Features'
import HabitHealthDisease from '../components/home/HabitHealth'

const FeaturesScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
    
      <View style={styles.colLeft}>
        <Features navigation={navigation} />
      </View>

      <View style={styles.colRight}>
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
    flex: 3,                 
  },
})
