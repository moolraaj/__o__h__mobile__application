import React from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useGetHabitHealthQuery } from '../../store/services/habithealth/habithealthApi'
import { useTranslation } from 'react-i18next'
import GradientText from '../../common/GradientText'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient'
import CardSkeletonItem from '../../common/CardSkeletonItem'

export default function HabitHealthList({ navigation }: { navigation: any }) {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const { data, isLoading, error, refetch } = useGetHabitHealthQuery({ page: 1, lang },
    {
      refetchOnMountOrArgChange: true,
    })
  const records = data?.result.slice(0, 2) ?? []


  return (
    <View style={styles.listContainer}>
      {isLoading ? <CardSkeletonItem count={2} /> : error || !data?.result ?
        (
          <View style={styles.errorCardsContainer}>
            {Array(2).fill(null).map((_, index) => (
              <TouchableOpacity
                key={`error-card-${index}`}
                style={[styles.card, styles.errorCard]}
                onPress={() => refetch()}
                activeOpacity={0.8}
              >
                <View style={styles.errorContent}>
                  <View style={styles.errorIconContainer}>
                    <Icon5 name="exclamation-triangle" size={15} color="#FF5E62" />
                  </View>
                  <Text style={styles.errorTitle}>Content Unavailable</Text>
                  <Text style={styles.errorMessage}>
                    Failed to load health habits
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) :
        <FlatList
          data={records}
          keyExtractor={(r) => r._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('HabitHealthDetail', { id: item._id })}
            >
              <Image
                source={{ uri: item.habits_health_main_image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {item.habits_health_main_title[lang]}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 8 }}
        />
      }

      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={['#56235E', '#C1392D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        >
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MythsAndFacts')}>
            <GradientText text={<Icon name="help-outline" size={20} style={{ marginRight: 6 }} />} size={20} />
            <Text style={styles.buttonText}>Myths & Facts</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#56235E', '#C1392D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        >
          <TouchableOpacity style={styles.button}>
            <GradientText text={<Icon name="question-answer" size={20} style={{ marginRight: 6 }} />} size={20} />
            <Text style={styles.buttonText}>FAQs</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  errorCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  errorCard: {
    flex: 1,
    aspectRatio: 1 / 0.6,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 12,
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
  listContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  gradientBorder: {
    flex: 0.48,
    borderRadius: 10,
    padding: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9.2,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
  },
  buttonText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '600',
  },
})
