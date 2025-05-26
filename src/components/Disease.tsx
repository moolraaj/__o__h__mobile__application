import CardSkeletonItem from '../common/CardSkeletonItem'
import React from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'

const PADDING_HORIZONTAL = 16
const CARD_GAP = 8
const MIN_CARD_WIDTH = 150

const SingleDisease = ({ disease, currentLanguage, isLoading, navigation }: any) => {
  const { width } = useWindowDimensions()

  const CARD_WIDTH = Math.max(
    (width - PADDING_HORIZONTAL * 2 - CARD_GAP) / 2,
    MIN_CARD_WIDTH
  )

  if (isLoading) {
    return <CardSkeletonItem count={6} />
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={disease}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: CARD_GAP }}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: CARD_WIDTH }]}
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
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
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
