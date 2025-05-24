import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React from 'react'
 
 
 
import { useGetDentalEmergencyQuery } from '../../store/services/dental_emergency/dentalEmergencyApi'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 36) / 2

const DentalEmergencyList = ({navigation}:{navigation:any}) => {
 
  const { data, isLoading, isError, error } = useGetDentalEmergencyQuery({})

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }


  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error: {error?.toString()}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.result
}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
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
            
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  card: {
    width: CARD_WIDTH,
    aspectRatio: 1 / 0.8,
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
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})

export default DentalEmergencyList