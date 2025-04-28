import React from 'react'
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native'
import { useRoute } from '@react-navigation/native'

import { useGetSingleFeatureCategoryQuery } from '../store/services/categories/categoryApi'
import Loader from '../common/Loader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import Disease from './Disease'

const SingleFeature = ({ navigation }: { navigation: any }) => {
    const route = useRoute()
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const { id } = route.params as { id: string }

    const { data, isLoading, error } = useGetSingleFeatureCategoryQuery({ id, lang: currentLanguage })


    if (isLoading) {
        return (

            <View style={styles.center}>
                <Loader/>
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
                <ScrollView>
                    <View style={styles.content}>
                        <Text style={styles.field}>
                            {result?.feature_inner_title?.[currentLanguage] || 'No Title'}
                        </Text>
                        <Text style={styles.field}>
                            {result?.feature_slug?.[currentLanguage] || 'No Slug'}
                        </Text>
                        {result?.feature_inner_image ? (
                            <Image
                                source={{ uri: result.feature_inner_image }}
                                style={styles.image}
                            />
                        ) : (
                            <Text>No Image Available</Text>
                        )}
                    </View>


                    <View style={styles.section}>

                        <Text style={styles.field}>
                            {result?.feature_myth_facts_title?.[currentLanguage] || null}
                        </Text>
                        <Text style={styles.field}>
                            {result?.feature_myth_facts_description?.[currentLanguage] || null}
                        </Text>
                    </View>

                    <View>
                        <Text>Diseases</Text>
                        <Disease disease={result?.diseases} currentLanguage={currentLanguage} navigation={navigation} />

                    </View>


                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Feature Facts</Text>
                        <FlatList
                            data={result?.feature_facts || []}
                            keyExtractor={(item, index) =>
                                item._id ? item._id.toString() : index.toString()
                            }
                            renderItem={({ item }) => (
                                <View style={styles.factItem}>
                                    <Text style={styles.factText}>{item?.para?.[currentLanguage] || null}</Text>
                                    <Image source={{ uri: item.icon }} style={{ width: 30, height: 30 }} />

                                </View>
                            )}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Feature Myths</Text>
                        <FlatList
                            data={result?.feature_myths || []}
                            keyExtractor={(item, index) =>
                                item._id ? item._id.toString() : index.toString()
                            }
                            renderItem={({ item }) => (
                                <View style={styles.factItem}>
                                    <Text style={styles.factText}>{item?.para?.[currentLanguage] || null}</Text>
                                    <Image source={{ uri: item.icon }} style={{ width: 30, height: 30 }} />
                                </View>
                            )}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>

    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    content: {
        marginVertical: 16,
    },
    field: {
        fontSize: 16,
        marginVertical: 4,
    },
    error: {
        color: 'red',
    },
    image: {
        width: 150,
        height: 150,
        marginTop: 12,
    },
    section: {
        marginVertical: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    factItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    factText: {
        fontSize: 16,
    },
})

export default SingleFeature
