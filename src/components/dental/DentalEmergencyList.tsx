import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetDentalEmergencyQuery } from '../../store/services/dental_emergency/dentalEmergencyApi';
import CardSkeletonItem from '../../common/CardSkeletonItem';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { commonGridStyles as styles } from '../../common/cardStyling';

const DentalEmergencyList = ({ navigation }: { navigation: any }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { data, isLoading, error, refetch } = useGetDentalEmergencyQuery(
    { refetchOnMountOrArgChange: true }
  );

  if (isLoading) {
    return <CardSkeletonItem count={3} />;
  }

  if (error || !data?.result) {
    return (
      <View style={styles.errorContainer}>
        {Array(3).fill(null).map((_, index) => (
          <TouchableOpacity
            key={`error-card-${index}`}
            style={[styles.cardContainer, styles.errorCard]}
            onPress={() => refetch()}
            activeOpacity={0.8}
          >
            <View style={styles.errorContent}>
              <View style={styles.errorIconContainer}>
                <Icon name="exclamation-triangle" size={15} color="#FF5E62" />
              </View>
              <Text style={styles.errorMessage}>
                Failed to load featured content. Tap to retry.
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.result}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
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
                  {item.dental_emergency_title?.[lang]}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default DentalEmergencyList;
