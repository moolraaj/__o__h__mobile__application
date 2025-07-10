import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import Features from '../components/Features';
import GradientText from '../common/GradientText';
import DentalEmergencyScreen from './DentalEmergencyScreen';
import HabitHealthDisease from '../components/home/HabitHealth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

const FeaturesScreen = ({ navigation }: { navigation: any }) => {
  // Color palette for the decorative line
  const colorPalette = ['#C1392D', '#56235E', '#3498db', '#2ecc71', '#f39c12'];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const animatedValue = React.useMemo(() => new Animated.Value(0), []);

 
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start(() => {
        setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colorPalette.length);
        animatedValue.setValue(0);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [colorPalette.length, animatedValue]);

  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colorPalette[currentColorIndex],
      colorPalette[(currentColorIndex + 1) % colorPalette.length],
    ],
  });

  const widthInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
     
      <View style={styles.headerContainer}>
        <GradientText text="Features" size={24} />
        <View style={styles.decorativeLineContainer}>
          <View style={[styles.decorativeLineBase, { backgroundColor: colorPalette[currentColorIndex] }]} />
          <Animated.View
            style={[
              styles.decorativeLineOverlay,
              {
                backgroundColor: interpolatedColor,
                width: widthInterpolation,
              },
            ]}
          />
        </View>
      </View>

 
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
            <Text style={styles.buttonText}>Myths & Facts</Text>
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
            <Text style={styles.buttonText}>FAQs</Text>
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
  headerContainer: {
    marginBottom: 16,
    paddingBottom: 5,
  },
  decorativeLineContainer: {
    height: 4,
    width: 60,
    position: 'relative',
    marginTop: 2,
  },
  decorativeLineBase: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 2,
  },
  decorativeLineOverlay: {
    position: 'absolute',
    height: '100%',
    borderRadius: 2,
  },
  contentContainer: {
    borderRadius: 12,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
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
