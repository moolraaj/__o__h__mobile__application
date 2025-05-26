import React from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useGetFeatureCategoryQuery } from '../store/services/categories/categoryApi'
import CardSkeletonItem from '../common/CardSkeletonItem'


const Features = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language
  const { data, isFetching } = useGetFeatureCategoryQuery({
    page: 1,
    limit: 10,
    lang: currentLanguage,
  },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  if (isFetching) {
    return <CardSkeletonItem count={1} />
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.result}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('FeatureDetail', { id: item._id })}
          >
            {item.feature_main_image && (
              <Image
                source={{ uri: item.feature_main_image }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {item.feature_main_title?.[currentLanguage]}
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
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
})

export default Features