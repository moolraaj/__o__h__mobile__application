 
import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native'
import { useGetSlidersQuery } from '../store/services/slider/sliderApi'
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window')



export const Slider = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { data, error, isLoading } = useGetSlidersQuery({
    page: 1,
    limit: 10,
    lang: currentLanguage,
  })

  const flatListRef = useRef<FlatList<any>>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

 
  useEffect(() => {
    if (!data?.result?.length) return
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.result.length
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
      setCurrentIndex(nextIndex)
    }, 2500)
    return () => clearInterval(timer)
  }, [currentIndex, data?.result?.length])

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  if (error || !data?.result) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Failed to load sliders</Text>
      </View>
    )
  }

  const slides = data.result

 
  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.text?.[currentLanguage]}</Text>
              <Text style={styles.subtitle}>{item.description?.[currentLanguage]}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('SliderDetails', { id: item._id })
                }
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: item.sliderImage }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    marginHorizontal: 8,
    padding: 16,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#eef',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#4a90e2',
    fontWeight: '600',
  },
  image: {
    width: width * 0.35,
    height: 140,
    borderRadius: 8,
  },
})
