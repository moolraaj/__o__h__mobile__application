import React from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  FlatList,

} from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'

import { useGetSingleSliderQuery } from '../store/services/slider/sliderApi'

 
import { useTranslation } from 'react-i18next'
 

type RootStackParamList = {
  Product: { id: string }
}

export const SingleSlider = () => {

  const route = useRoute<RouteProp<RootStackParamList, 'Product'>>()
  const { id } = route.params

   const { i18n } = useTranslation();
     const currentLanguage = i18n.language;

  const { data, error, isLoading } = useGetSingleSliderQuery({ id, lang: currentLanguage })

  

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Could not load slider #{id}</Text>
      </View>
    )
  }

 

  const sliderItems = data.data.body

  return (

    <>
     <FlatList
      data={sliderItems}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.text?.[currentLanguage]}</Text>
          <Text style={styles.desc}>{item.description?.[currentLanguage]}</Text>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
      
      contentContainerStyle={styles.container}
    />

    <Text>
   

    </Text>
    </>
   
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16 },
 
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 4,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 14, color: '#555', marginBottom: 8 },
  image: { width: '100%', height: 200, borderRadius: 6 },
})
