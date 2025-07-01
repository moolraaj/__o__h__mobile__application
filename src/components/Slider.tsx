import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Modal,             // ← NEW
  ActivityIndicator, // ← NEW
} from 'react-native';
import Video from 'react-native-video'; // ← NEW
import { useGetSlidersQuery } from '../store/services/slider/sliderApi';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../common/GradientText';
import SliderSkeleton from '../common/SliderSkeleton';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_SPACING = 5;

export const Slider = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { data, error, isLoading, refetch } = useGetSlidersQuery(
    { page: 1, limit: 10, lang: currentLanguage },
    { refetchOnMountOrArgChange: true }
  );

  const sliderRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ← NEW: modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.result?.length) return;
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % data.result.length;
        sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [data?.result?.length]);

  if (isLoading) {
    return <SliderSkeleton />;
  }

  if (error || !data?.result) {
    return (
      <View style={styles.errorWrapper}>
        <LinearGradient
          colors={['#56235E', '#C1392D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.errorContainer}
        >
          <View style={styles.errorContent}>
            <View style={styles.errorIconContainer}>
              <LinearGradient
                colors={['#fff', '#f8f8f8']}
                style={styles.errorIconBackground}
              >
                <Icon name="exclamation-triangle" size={28} color="#FF416C" />
              </LinearGradient>
            </View>

            <View style={styles.errorTextContainer}>
              <GradientText text="Loading Error" colors={['#fff', '#f8f8f8']} />
              <Text style={styles.errorMessage}>
                We couldn't load the slider content. Please try again later.
              </Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const slides = data.result;

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING)
    );
    setCurrentIndex(index);
  };

  const renderDots = () => {
    if (slides.length <= 1) return null;

    const maxVisibleDots = 3;
    let dotsToShow = slides;

    if (slides.length > maxVisibleDots) {
      const start = Math.max(
        0,
        Math.min(currentIndex - 1, slides.length - maxVisibleDots)
      );
      dotsToShow = slides.slice(start, start + maxVisibleDots);
    }

    return (
      <View style={styles.dotsWrapper}>
        {dotsToShow.map((_, index) => {
          const realIndex =
            slides.length > maxVisibleDots
              ? Math.max(
                  0,
                  Math.min(currentIndex - 1, slides.length - maxVisibleDots)
                ) + index
              : index;
          const isActive = realIndex === currentIndex;
          return (
            <TouchableOpacity
              key={realIndex}
              onPress={() => {
                sliderRef.current?.scrollToIndex({
                  index: realIndex,
                  animated: true,
                });
                setCurrentIndex(realIndex);
              }}
              style={[styles.dotContainer, isActive && styles.activeDotContainer]}
            >
              <View style={[styles.dot, isActive && styles.activeDot]} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const gradients = [
    ['#56235E', '#C1392D'],
    ['#1E90FF', '#FF69B4'],
    ['#4CAF50', '#8E24AA'],
    ['#2196F3', '#6A1B9A'],
  ];

  // ← NEW: handlers to open/close modal
  const openVideo = (url: string) => {
    setVideoUrl(url);
    setModalVisible(true);
  };
  const closeVideo = () => {
    setModalVisible(false);
    setVideoUrl(null);
  };

  return (
    <View style={styles.slideWrapper}>
      <FlatList
        ref={sliderRef}
        data={slides}
        keyExtractor={item => item._id}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: CARD_SPACING }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item, index }) => {
          const colors = gradients[index % gradients.length];
          return (
            <TouchableOpacity
              onPress={() => openVideo(item.sliderVideo)}    // ← CHANGED
              style={styles.slide}
            >
              <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: CARD_WIDTH, borderRadius: 16 }}
              >
                <View style={styles.content}>
                  <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                      {item.text?.[currentLanguage]}
                    </Text>

                    <Text
                      style={styles.subtitle}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.description?.[currentLanguage]}
                    </Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => openVideo(item.sliderVideo)}   
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
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
      />

      {renderDots()}

      {/* ← NEW: Video Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeVideo}
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {videoUrl && (
              <Video
                source={{ uri: videoUrl }}
                style={styles.video}
                controls
                resizeMode="contain"
                paused={false}
                onError={console.error}
                onBuffer={() => <ActivityIndicator size="large" color="#fff" />}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeVideo}>
              <Icon name="times-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  errorWrapper: {
    height: 100,
    marginBottom: 20,
    overflow: 'hidden',
  },
  errorContainer: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#FF416C',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIconContainer: {
    marginRight: 15,
  },
  errorIconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTextContainer: {
    flex: 1,
  },
  errorHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorMessage: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  slideWrapper: {
    height: 176,
    overflow: 'hidden',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 176,
  },
  slide: {
    width: CARD_WIDTH,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CARD_SPACING,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 10,
  },
  textContainer: {
    flex: 2,
    marginLeft: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    flexShrink: 1,
  },
  subtitle: {
    color: '#f8f8f8',
    fontSize: 13,
    marginBottom: 10,
    flexShrink: 1,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  image: {
    width: CARD_WIDTH * 0.5,
    height: CARD_WIDTH * 0.5,
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
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

  // ← NEW Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000dd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
