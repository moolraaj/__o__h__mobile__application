import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useGetSingleDentalEmergencyQuery } from '../../store/services/dental_emergency/dentalEmergencyApi'
import { useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const SingleDentalEmergencyDetail = () => {
    const { id } = useRoute().params as { id: string }
    const { i18n } = useTranslation()
    const currentLanguage = i18n.language
    const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({})

    const { data, isLoading, isError, error } = useGetSingleDentalEmergencyQuery({ id })

    const toggleTab = (tabIndex: string) => {
        setExpandedTabs(prev => ({
            ...prev,
            [tabIndex]: !prev[tabIndex]
        }))
    }

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (isError) {
        return (
            <View style={styles.center}>
                <Text>Error: {error?.toString()}</Text>
            </View>
        )
    }

    const emergency = data?.result

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: emergency?.dental_emergency_image }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <Text style={styles.title}>
                    {emergency?.dental_emergency_title?.[currentLanguage]}
                </Text>

                <Text style={styles.heading}>
                    {emergency?.dental_emergency_heading?.[currentLanguage]}
                </Text>

                <Text style={styles.paragraph}>
                    {emergency?.dental_emergency_para?.[currentLanguage]}
                </Text>

                {/* Inner Content Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {emergency?.dental_emergency_inner_title?.[currentLanguage]}
                    </Text>
                    <Text style={styles.paragraph}>
                        {emergency?.dental_emergency_inner_para?.[currentLanguage]}
                    </Text>
                </View>

                {/* Main Emergency Content */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {emergency?.dental_emer_title?.[currentLanguage]}
                    </Text>
                    <Text style={styles.subTitle}>
                        {emergency?.dental_emer_sub_title?.[currentLanguage]}
                    </Text>

                    {/* Repeater Sections with Toggle */}
                    {emergency?.dental_emer_repeater?.map((item, index) => (
                        <View key={index} style={styles.tabSection}>
                            <TouchableOpacity 
                                onPress={() => toggleTab(index.toString())}
                                style={styles.tabHeader}
                            >
                                <Text style={styles.tabTitle}>
                                    {item.dental_emer_tab_title?.[currentLanguage]}
                                </Text>
                                <Text style={styles.toggleIcon}>
                                    {expandedTabs[index.toString()] ? '−' : '+'}
                                </Text>
                            </TouchableOpacity>

                            {expandedTabs[index.toString()] && (
                                <View style={styles.tabContent}>
                                    {item.denatl_emer_description_repeater?.map((desc, descIndex) => (
                                        <View key={descIndex} style={styles.descriptionItem}>
                                            <Text style={styles.descriptionHeading}>
                                                {desc.denatl_emer_tab_heading?.[currentLanguage]}
                                            </Text>
                                            <Text style={styles.descriptionText}>
                                                {desc.denatl_emer_tab_paragraph?.[currentLanguage]}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    heading: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#444',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        color: '#555',
    },
    section: {
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 15,
        color: '#444',
    },
    tabSection: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
    },
    tabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    tabTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    toggleIcon: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    tabContent: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    descriptionItem: {
        marginBottom: 15,
    },
    descriptionHeading: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#444',
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
    },
})

export default SingleDentalEmergencyDetail