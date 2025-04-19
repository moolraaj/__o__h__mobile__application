import React from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useGetHabitHealthQuery } from '../../store/services/habithealth/habithealthApi'
import { useTranslation } from 'react-i18next'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function HabitHealthList({ navigation }: { navigation: any }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const { data, isLoading, error } = useGetHabitHealthQuery({ page: 1, lang })

  if (isLoading) return <Text>Loading…</Text>
  if (error) return <Text>Error loading habits</Text>

 
  const records = data?.result.slice(0,2) ?? []

  const renderCard = (item: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('HabitHealthDetail', { id:item._id })
      }
    >
      <Image
        source={{ uri: item.habits_health_main_image }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>
        {item.habits_health_main_title[lang]}
      </Text>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={records}
      keyExtractor={r => r._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => renderCard(item)}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    width: SCREEN_WIDTH - 32,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    padding: 12,
  },
})
