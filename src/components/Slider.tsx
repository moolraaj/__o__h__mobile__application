
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { useGetSlidersQuery } from '../store/services/slider/sliderApi';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../common/GradientText';
import Loader from '../common/Loader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_SPACING = 12;

export const Slider = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { data, error, isLoading } = useGetSlidersQuery({
    page: 1,
    limit: 10,
    lang: currentLanguage,
  });

  const sliderRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data?.result?.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.result.length;
        sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [data?.result?.length]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Loader/>
      </View>
    );
  }

  if (error || !data?.result) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Failed to load sliders</Text>
      </View>
    );
  }

  const slides = data.result;

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  };

  const renderDots = () => {
    if (slides.length <= 1) return null;

    const maxVisibleDots = 3;
    let dotsToShow = slides;

    if (slides.length > maxVisibleDots) {
      const start = Math.max(0, Math.min(currentIndex - 1, slides.length - maxVisibleDots));
      dotsToShow = slides.slice(start, start + maxVisibleDots);
    }

    return (
      <View style={styles.dotsWrapper}>
        {dotsToShow.map((_, index) => {
          const realIndex =
            slides.length > maxVisibleDots
              ? Math.max(0, Math.min(currentIndex - 1, slides.length - maxVisibleDots)) + index
              : index;
          const isActive = realIndex === currentIndex;
          return (
            <TouchableOpacity
              key={realIndex}
              onPress={() => {
                sliderRef.current?.scrollToIndex({ index: realIndex, animated: true });
                setCurrentIndex(realIndex);
              }}
              style={[
                styles.dotContainer,
                isActive && styles.activeDotContainer,
              ]}
            >
              <View style={[styles.dot, isActive && styles.activeDot]} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const gradients = [
    ['#56235E', '#C1392D'], // your existing one (purple -> red)
    ['#1E90FF', '#FF69B4'], // blue -> pink (second card)
    ['#4CAF50', '#8E24AA'], // green -> violet (third card)
    ['#2196F3', '#6A1B9A'], // light blue -> purple (fourth card)
  ];

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={sliderRef}
        data={slides}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: CARD_SPACING,
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item, index }) => {
          const colors = gradients[index % gradients.length];  // This will loop through 4 gradients
          return (
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.slide}
            >
              <View style={styles.content}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.text?.[currentLanguage]}</Text>
                  <Text style={styles.subtitle}>{item.description?.[currentLanguage]}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SliderDetails', { id: item._id })}
                  >
                    <GradientText text="View" />
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: item.sliderImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            </LinearGradient>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
      />
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 180,
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  slide: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#f8f8f8',
    fontSize: 13,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  dotContainer: {
    marginHorizontal: 4,
  },
  activeDotContainer: {
    borderWidth: 2,
    borderColor: '#C1392D',
    borderRadius: 12,
    padding: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C1392D',
  },
  activeDot: {
    backgroundColor: '#56235E',
  },
});
