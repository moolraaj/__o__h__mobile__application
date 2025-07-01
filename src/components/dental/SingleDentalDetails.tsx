import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'
import React, { useState } from 'react'
import { useGetSingleDentalEmergencyQuery } from '../../store/services/dental_emergency/dentalEmergencyApi'
import { useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import GradientText from '../../common/GradientText'
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient'
import { AppError } from '../../common/AppError'

const SingleDentalEmergencyDetail = () => {
    const { id } = useRoute().params as { id: string }
    const { i18n } = useTranslation()
    const currentLanguage = i18n.language as keyof Language;
    const [expandedTab, setExpandedTab] = useState<string | null>(null);

    const { data, isLoading, error, refetch } = useGetSingleDentalEmergencyQuery({ id })

    const toggleTab = (tabIndex: string) => {
        setExpandedTab(prev => prev === tabIndex ? null : tabIndex)
    }

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

    const emergency = data?.result
 

    return (
        <ScrollView style={styles.container}>
            <View style={styles.sectionContainer}>
                <View style={styles.textContainer}>
                    <Text>
                        <Text style={styles.title}>
                            <GradientText text={emergency?.dental_emergency_title?.[currentLanguage]} size={22} />
                        </Text>
                    </Text>
                    <Text>{emergency?.dental_emergency_para?.[currentLanguage]}</Text>
                </View>
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: emergency?.dental_emergency_image }}
                        style={styles.diseaseIcon}
                        resizeMode="cover"
                    />
                </View>
            </View>

            <View>
                {/* Heading Section */}
                <View style={styles.sectionCard}>
                    <View style={styles.headingOuter}>
                        <GradientText text={<Icon name='tooth' size={20} />} size={22} />
                        <Text style={styles.heading}>
                            {emergency?.dental_emergency_inner_title?.[currentLanguage]}
                        </Text>
                    </View>
                    <Text style={styles.paragraph}>
                        {emergency?.dental_emergency_inner_para?.[currentLanguage]}
                    </Text>
                </View>

                {/* Main Emergency Content */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleOuter}>
                        <GradientText text={<AntDesign name='exclamationcircleo' size={20} />} />
                        <Text style={styles.sectionTitle}>
                            {emergency?.dental_emer_title?.[currentLanguage]}
                        </Text>
                    </View>
                    <Text style={styles.subTitle}>
                        <GradientText text={emergency?.dental_emer_sub_title?.[currentLanguage]} size={18} />
                    </Text>

                    {/* Repeater Sections with Toggle */}
                    {emergency?.dental_emer_repeater?.map((item, index) => {
                        const tabKey = index.toString();
                        const isExpanded = expandedTab === tabKey;

                        return (
                            <View style={styles.tabSection} key={index}>
                                <LinearGradient
                                    colors={['#F5DAFF', '#FFD7D8']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.tabHeaderGradient}
                                >
                                    <TouchableOpacity
                                        onPress={() => toggleTab(tabKey)}
                                        style={styles.tabHeader}
                                    >
                                        <GradientText
                                            text={item.dental_emer_tab_title?.[currentLanguage]}
                                            size={20}
                                            colors={['#56235F', '#C0392E']}
                                        />
                                        <Text style={styles.toggleIcon}>
                                            {isExpanded ? (
                                                <Entypo name="chevron-up" size={20} />
                                            ) : (
                                                <Entypo name="chevron-down" size={20} />
                                            )}
                                        </Text>
                                    </TouchableOpacity>
                                </LinearGradient>

                                {isExpanded && (
                                    <View style={styles.tabContent}>
                                        {item.denatl_emer_description_repeater?.map((desc, descIndex) => (
                                            <View key={descIndex} style={styles.descriptionItem}>
                                                <Text style={styles.descriptionHeading}>
                                                    <GradientText text={desc.denatl_emer_tab_heading?.[currentLanguage]} />
                                                </Text>
                                                <Text style={styles.descriptionText}>
                                                    {desc.denatl_emer_tab_paragraph?.[currentLanguage]}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )
                    })}
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
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    textContainer: {
        width: '80%',
        alignItems: 'flex-start',
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
    diseaseIcon: {
        width: 40,
        height: 40,
        borderRadius: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    headingOuter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: '600',
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
    sectionTitleOuter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 15,
    },
    tabSection: {
        overflow: 'hidden',
    },
    tabHeaderGradient: {
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 15,
    },
    tabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    tabTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    toggleIcon: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    tabContent: {
        paddingHorizontal: 12,
        paddingBottom: 5,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
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
    sectionCard: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#E8F3F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#E8F3F1',
    },
})

export default SingleDentalEmergencyDetail