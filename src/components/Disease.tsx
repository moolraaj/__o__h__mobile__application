import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 36) / 2 // Subtracting total horizontal padding (16*2 + 4)

const SingleDisease = ({ disease, currentLanguage, navigation }: any) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={disease}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SingleDisease', { id: item._id })}
          >
            <Image
              source={{ uri: item.disease_main_image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {item?.disease_main_title?.[currentLanguage] || ''}
              </Text>
            </View>
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
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  card: {
    width: CARD_WIDTH,
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
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
})

export default SingleDisease