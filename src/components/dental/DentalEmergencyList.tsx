import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetDentalEmergencyQuery } from '../../store/services/dental_emergency/dentalEmergencyApi'
import CardSkeletonItem from '../../common/CardSkeletonItem'

const DentalEmergencyList = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const { data, isLoading, isError, error } = useGetDentalEmergencyQuery(
    {
      refetchOnMountOrArgChange: true,
    })

  if (isLoading) {
    return <CardSkeletonItem count={1} />
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error: {error?.toString()}</Text>
      </View>
    )
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={data?.result
        }
        numColumns={2}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DentalEmergencyDetails', { id: item._id })}
          >
            <Image
              source={{ uri: item.dental_emergency_image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {item.habits_health_main_title?.[lang] || 'Dental Emergency'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  listContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
    aspectRatio: 1 / 0.6,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
})

export default DentalEmergencyList