import React from 'react'
import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useGetSingleFeatureCategoryQuery } from '../store/services/categories/categoryApi'
import Loader from '../common/Loader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import Disease from './Disease'
import GradientText from '../common/GradientText'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'

const SingleFeature = ({ navigation }: { navigation: any }) => {
    const route = useRoute()
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { id } = route.params as { id: string }
    const { data, isLoading, error } = useGetSingleFeatureCategoryQuery({ id, lang: currentLanguage })

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Loader />
            </View>
        )
    }
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Error fetching category</Text>
            </View>
        )
    }
    const result = data?.data
    return (

        <>
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={['#F8E4FF', '#FFD7D8']}
                    locations={[0.2081, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sectionContainer}
                >
                    <View style={styles.textContainer}>
                        <GradientText text={result?.feature_inner_title?.[currentLanguage] || 'No Title'} size={22} />
                        <Text> {result?.feature_slug?.[currentLanguage] || 'No Slug'}
                        </Text>
                    </View>
                    <View style={styles.imageWrapper}>
                        {result?.feature_inner_image ? (
                            <Image
                                source={{ uri: result.feature_inner_image }}
                                style={styles.image}
                            />
                        ) : (
                            <Text>No Image Available</Text>
                        )}
                    </View>
                </LinearGradient>

                <View>
                    <Text style={styles.title_field}>
                        <GradientText text="Diseases" size={22} />
                    </Text>
                    <Disease disease={result?.diseases} currentLanguage={currentLanguage} navigation={navigation} />
                </View>

                <View style={styles.section}>
                     {/* Heading & Description */} 
                    <Text style={styles.heading}>
                        <GradientText text={result?.feature_myth_facts_title?.[currentLanguage] || null} size={22} />
                    </Text>
                    <Text style={styles.description}>{result?.feature_myth_facts_description?.[currentLanguage] || null}</Text>
                </View>


                {/* Myths */}
                <View style={styles.mythFactsSection}>
                    <Text style={styles.sectionHeader}>
                        <GradientText text="Feature Myths" />
                    </Text>
                    <LinearGradient
                        colors={['#F8E4FF', '#FFD7D8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.mythBox}>
                        <FlatList
                            data={result?.feature_myths || []}
                            keyExtractor={(item, index) =>
                                item._id ? item._id.toString() : index.toString()
                            }
                            renderItem={({ item }) => (
                                <View style={styles.factRow}>
                                    <Entypo name="cross" color="#FF473E" size={24} style={styles.icon} />
                                    <Text style={styles.factText}>{item?.para?.[currentLanguage] || null}</Text>
                                    <Image source={{ uri: item.icon }} style={{ width: 10, height: 10 }} />
                                </View>
                            )}
                        />
                    </LinearGradient>
                </View>

                {/* Facts */}
                <View style={styles.mythFactsSection}>
                    <Text style={styles.sectionHeader}>
                        <GradientText text="Feature Facts" />
                    </Text>
                    <LinearGradient
                        colors={['#E0FAFF', '#F8E2FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.factBox}>
                        <FlatList
                            data={result?.feature_facts || []}
                            keyExtractor={(item, index) =>
                                item._id ? item._id.toString() : index.toString()
                            }
                            renderItem={({ item }) => (
                                <View style={styles.factRow}>
                                    <Entypo name="check" color="#34A853" size={22} style={styles.icon} />
                                    <Text style={styles.factText}>{item?.para?.[currentLanguage] || null}</Text>
                                    <Image source={{ uri: item.icon }} style={{ width: 30, height: 30 }} />
                                </View>
                            )}
                        />
                    </LinearGradient>
                </View>

            </SafeAreaView >
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionContainer: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'flex-start',
        width: '80%',
        flexDirection: 'column',
        gap: 5,
        paddingRight: 10,
    },
    imageWrapper: {
        width: '20%',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title_field: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    field: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
        marginVertical: 4,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    error: {
        color: 'red',
    },
    image: {
        width: 50,
        height: 50,
        marginTop: 12,
    },
    section: {
        flex: 1,
        marginVertical: 20,
        alignItems: 'flex-start',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    mythFactsSection: {
        flex: 1,
        flexDirection: 'column',
    },
    mythBox: {
        flex: 1,
        backgroundColor: '#FEE2E2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    factBox: {
        backgroundColor: '#DCFCE7',
        padding: 16,
        borderRadius: 12,
    },
    factRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: 5,
        marginTop: 2
    },
    factText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
        paddingBottom: 10,
        lineHeight: 22
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#800080',
        marginBottom: 4,
    },
    description: {
        fontSize: 15,
        color: '#5A5A5A',
        marginBottom: 16,
        lineHeight: 22
    },
})

export default SingleFeature
