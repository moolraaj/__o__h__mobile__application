import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Features from '../components/Features';
import GradientText from '../common/GradientText';
import DentalEmergencyScreen from './DentalEmergencyScreen';
import HabitHealthDisease from '../components/home/HabitHealth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { WHITE } from '../constants/Variables';
import { GlobalText } from '../constants/GlobalText';

const FeaturesScreen = ({ navigation }: { navigation: any }) => {

  return (
    <View style={styles.container}>


      <View style={styles.contentContainer}>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="teeth-open" size={18} color="#C1392D" style={styles.sectionIcon} />
            <GradientText text="Oral Diseases" size={18} />
          </View>
          <View style={styles.sectionContent}>
            <Features navigation={navigation} />
          </View>
        </View>


        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="first-aid" size={18} color="#C1392D" style={styles.sectionIcon} />
            <GradientText text="Dental Emergency" size={18} />
          </View>
          <View style={styles.sectionContent}>
            <DentalEmergencyScreen navigation={navigation} />
          </View>
        </View>

        {/* Habit Health section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="heartbeat" size={18} color="#C1392D" style={styles.sectionIcon} />
            <GradientText text="Habit Health" size={18} />
          </View>
          <View style={styles.sectionContent}>
            <HabitHealthDisease navigation={navigation} />
          </View>
        </View>
      </View>

      {/* Bottom buttons with improved styling */}
      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={['#56235E', '#C1392D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MythsAndFacts')}
          >
            <GradientText
              text={<Icon name="lightbulb" size={20} style={styles.buttonIcon} />}
              size={20}
            />
            <GlobalText style={styles.buttonText}>Myths & Facts</GlobalText>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#56235E', '#C1392D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('FaqsScreen')}
          >
            <GradientText
              text={<Icon name="question-circle" size={20} style={styles.buttonIcon} />}
              size={20}
            />
            <GlobalText style={styles.buttonText}>FAQs</GlobalText>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  contentContainer: {
    borderRadius: 12,
    shadowColor: WHITE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionContent: {
    position: 'relative',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 16,
  },
  gradientBorder: {
    flex: 0.48,
    borderRadius: 10,
    padding: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9.2,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FeaturesScreen;
