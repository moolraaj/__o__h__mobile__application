
import React from 'react'
import {
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,

} from 'react-native'

import { useTranslation } from 'react-i18next'
import { useGetFeatureCategoryQuery } from '../store/services/categories/categoryApi'


const CARD_MARGIN = 8


const Features = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { data, isFetching } = useGetFeatureCategoryQuery({
    page: 1,
    limit: 10,
    lang: currentLanguage,
  })

  return (
    <>
      <FlatList
        data={data?.result}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshing={isFetching}
        renderItem={({ item }) => (
          <TouchableOpacity

            onPress={() => {

              navigation.navigate('FeatureDetail', { id: item._id })
            }}
          >
            {item.feature_main_image ? (
              <Image
                source={{ uri: item.feature_main_image }}
                style={styles.image}
              />
            ) : null}
            <Text style={styles.title}>
              {item.feature_main_title?.[currentLanguage]}
            </Text>
          </TouchableOpacity>
        )}
      />
    </>

  )
}

export default Features

const styles = StyleSheet.create({
  list: {
    padding: CARD_MARGIN,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },

  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    padding: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
