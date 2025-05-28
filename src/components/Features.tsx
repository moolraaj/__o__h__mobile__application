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
import Icon from 'react-native-vector-icons/FontAwesome5';

const Features = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language
  const { data, error, isFetching, refetch } = useGetFeatureCategoryQuery({
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

  if (error || !data?.result) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.card, styles.errorCard]}
          onPress={() => refetch()}
          activeOpacity={0.8}
        >
          <View style={styles.errorContent}>
            <View style={styles.errorIconContainer}>
              <Icon name="exclamation-triangle" size={15} color="#FF5E62" />
            </View>
            <Text style={styles.errorTitle}>Content Unavailable</Text>
            <Text style={styles.errorMessage}>
              Failed to load featured content. Tap to retry.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.result.slice(0,1)}
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
  errorCard: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  errorContent: {
    alignItems: 'center',
    padding: 10,
  },
  errorIconContainer: {
    backgroundColor: '#FFEBEE',
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorTitle: {
    color: '#D32F2F',
    fontSize: 14, 
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
    includeFontPadding: false,
  },
  errorMessage: {
    color: '#D32F2F',
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.9,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 16,
  },
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