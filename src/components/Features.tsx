import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGetFeatureCategoryQuery } from '../store/services/categories/categoryApi';
import CardSkeletonItem from '../common/CardSkeletonItem';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { commonGridStyles as gridStyles } from '../common/cardStyling';

const Features = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { data, error, isFetching, refetch } = useGetFeatureCategoryQuery({
    page: 1,
    limit: 10,
    lang: currentLanguage,
  }, {
    refetchOnMountOrArgChange: true,
  });

  if (isFetching) {
    return <CardSkeletonItem count={3} />;
  }

  if (error || !data?.result) {
    return (
      <View style={gridStyles.errorContainer}>
        {Array(3).fill(null).map((_, index) => (
          <TouchableOpacity
            key={`error-card-${index}`}
            style={[gridStyles.cardContainer, gridStyles.errorCard]}
            onPress={() => refetch()}
            activeOpacity={0.8}
          >
            <View style={gridStyles.errorContent}>
              <View style={gridStyles.errorIconContainer}>
                <Icon name="exclamation-triangle" size={15} color="#FF5E62" />
              </View>
              <Text style={gridStyles.errorMessage}>
                Failed to load featured content. Tap to retry.
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // If there's only one item, render it full width
  if (data?.result?.length === 1) {
    const item = data.result[0];
    return (
      <View style={styles.singleItemContainer}>
        <TouchableOpacity
          style={styles.singleCard}
          onPress={() => navigation.navigate('FeatureDetail', { id: item._id })}
        >
          {item.feature_main_image && (
            <Image
              source={{ uri: item.feature_main_image }}
              style={styles.singleImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.singleTitleContainer}>
            <Text style={styles.singleTitle}>
              {item.feature_main_title?.[currentLanguage]}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // For multiple items, use the standard 3-column grid
  return (
    <View style={gridStyles.container}>
      <FlatList
        data={data?.result}
        numColumns={3}
        columnWrapperStyle={gridStyles.columnWrapper}
        contentContainerStyle={gridStyles.contentContainer}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={gridStyles.cardContainer}>
            <TouchableOpacity
              style={gridStyles.card}
              onPress={() => navigation.navigate('FeatureDetail', { id: item._id })}
            >
              {item.feature_main_image && (
                <Image
                  source={{ uri: item.feature_main_image }}
                  style={gridStyles.image}
                  resizeMode="cover"
                />
              )}
              <View style={gridStyles.titleContainer}>
                <Text style={gridStyles.title}>
                  {item.feature_main_title?.[currentLanguage]}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  singleItemContainer: {
    width: '100%',
  },
  singleCard: {
    width: '100%',
    aspectRatio: 1 / 0.3,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  singleTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
  },
  singleTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default Features;
