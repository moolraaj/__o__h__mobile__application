import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useGetHabitHealthQuery } from '../../store/services/habithealth/habithealthApi';
import { useTranslation } from 'react-i18next';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import CardSkeletonItem from '../../common/CardSkeletonItem';
import { commonGridStyles as styles } from '../../common/cardStyling';

export default function HabitHealthList({ navigation }: { navigation: any }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { data, isLoading, error, refetch } = useGetHabitHealthQuery({ page: 1, lang }, {
    refetchOnMountOrArgChange: true,
  });
  const records = data?.result ?? [];

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
                <Icon5 name="exclamation-triangle" size={15} color="#FF5E62" />
              </View>
              <Text style={styles.errorMessage}>
                Failed to load health habits
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
        data={records}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('HabitHealthDetail', { id: item._id })}
            >
              <Image
                source={{ uri: item.habit_health_main_image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {item.habit_health_main_title[lang]}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
