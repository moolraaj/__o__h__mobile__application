import React from 'react'
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useGetSingleFeatureCategoryQuery } from '../store/services/categories/categoryApi'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import Disease from './Disease'
import GradientText from '../common/GradientText'
import LinearGradient from 'react-native-linear-gradient'

import { AppError } from '../common/AppError'

const SingleFeature = ({ navigation }: { navigation: any }) => {
    const route = useRoute()
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { id } = route.params as { id: string }
    const { data, isLoading, error, refetch } = useGetSingleFeatureCategoryQuery({ id, lang: currentLanguage },
        {
            refetchOnMountOrArgChange: true,
        })

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
    if (error || !data) {
        return <AppError onRetry={() => refetch()} />
    }
    const result = data?.data

    console.log(`data`)
    console.log(data)
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
                        <View style={styles.textTitle}>
                            <GradientText text={result?.feature_inner_title?.[currentLanguage] || 'No Title'} size={22} />
                        </View>
                        <Text> {result?.feature_inner_description?.[currentLanguage] || 'No Description'} </Text>
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
                    <Disease disease={result?.diseases} currentLanguage={currentLanguage} navigation={navigation} isLoading={isLoading} />
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
    textTitle: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        paddingLeft: 0,
        marginLeft: 0,
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