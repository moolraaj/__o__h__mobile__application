import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Loader from '../common/Loader'
import { useGetSingleSliderQuery } from '../store/services/slider/sliderApi'
import GradientText from '../common/GradientText'

type RootStackParamList = {
  Product: { id: string }
}

export const SingleSlider = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Product'>>()
  const { id } = route.params

  const { i18n } = useTranslation()
  const currentLanguage = i18n.language

  const { data, error, isLoading } = useGetSingleSliderQuery({ id, lang: currentLanguage })

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Loader />
      </View>
    )
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load slider #{id}</Text>
      </View>
    )
  }

  const sliderItems = data.data.body

  return (
    <FlatList
      data={sliderItems}
      keyExtractor={(item) => item._id}
      renderItem={({ item, index }) => (
        <View style={styles.card}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.titleWrapper}>
            <GradientText text={`${index + 1}`} size={28} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.text?.[currentLanguage] || 'No title'}</Text>
              <Text style={styles.desc}>{item.description?.[currentLanguage] || 'No description'}</Text>
            </View>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={{ fontSize: 16, color: '#777' }}>No slider items available.</Text>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    padding: 1,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  desc: {
    fontSize: 14,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 4,
  },
})
