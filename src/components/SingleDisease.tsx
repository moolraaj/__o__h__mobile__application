import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGetSingleDiseasesQuery } from '../store/services/disease/diseaseApi';
import { useTranslation } from 'react-i18next';
import GradientText from '../common/GradientText';
import LinearGradient from 'react-native-linear-gradient';
import CardSkeletonItem from '../common/CardSkeletonItem';

const SingleDisease = ({ navigation }: { navigation: any }) => {
    const { id } = useRoute().params as { id: string };
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language as keyof Language;
    const { data, isLoading } = useGetSingleDiseasesQuery({ id, lang: currentLanguage },
        {
            refetchOnMountOrArgChange: true,
        });
    const [activeTab, setActiveTab] = useState('what_is');

    if (!data?.data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    const diseaseData = data.data;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'what_is':
                return (
                    <ScrollView style={styles.tabContent}>
                        <Text style={styles.title}>{diseaseData.what_is_disease_tab_title?.[currentLanguage]}</Text>

                        {/* Images Grid Container */}
                        <View style={styles.imagesGridContainer}>
                            {isLoading ? <CardSkeletonItem count={4} /> : (
                                diseaseData.what_is_disease_repeat?.map((item, index) => (
                                    item.what_is_disease_repeat_images?.map((imageUrl, imgIndex) => (
                                        <TouchableOpacity
                                            key={`disease-image-${index}-${imgIndex}`}
                                            style={styles.imageCard}
                                            onPress={() => {/* Handle image press if needed */ }}
                                        >
                                            <Image
                                                source={{ uri: imageUrl }}
                                                style={styles.gridImage}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    ))
                                ))
                            )}
                        </View>

                        {diseaseData.what_is_disease_repeat?.map((item, index) => (
                            <View key={index} style={styles.diseasesRepeatSection}>
                                <Text style={styles.sectionTitle}>
                                    <GradientText text={item.what_is_disease_heading?.[currentLanguage]} size={20} />
                                </Text>
                                <Text style={styles.description}>
                                    {item.what_is_disease_disease_repeat_description?.[currentLanguage]}
                                </Text>
                                {item.what_is_disease_heading_description_repeater?.map((subItem: WhatIsDiseaseDescriptionRepeater, subIndex: number) => (
                                    <View key={subIndex} style={styles.subSection}>
                                        <Text style={styles.subSectionTitle}>
                                            {subItem.what_is_disease_heading_repeat?.[currentLanguage]}
                                        </Text>
                                        <Text style={styles.subSectionDescription}>
                                            {subItem.what_is_disease_description_repeat?.[currentLanguage]}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                );
            case 'causes':
                return (
                    <ScrollView style={styles.tabContent}>
                        <Text style={styles.title}>{diseaseData.common_cause_tab_title?.[currentLanguage]}</Text>

                        {diseaseData.common_cause?.map((cause, index) => (
                            <View key={index} style={styles.diseasesRepeatSection}>
                                <View style={styles.headerWithIcon}>
                                    {cause.cause_icon && (
                                        <Image
                                            source={{ uri: cause.cause_icon }}
                                            style={styles.icon}
                                        />
                                    )}
                                    <Text style={styles.sectionTitle}>{cause.cause_title?.[currentLanguage]}</Text>
                                </View>
                                <Text style={styles.description}>{cause.cause_para?.[currentLanguage]}</Text>

                                <Text style={styles.brief}>{cause.cause_brief?.[currentLanguage]}</Text>
                                {cause.cause_repeat?.map((subCause, subIndex) => (
                                    <View key={subIndex} style={styles.subSection}>
                                        <View style={styles.headerWithIcon}>
                                            {subCause.cause_repeat_icon && (
                                                <Image
                                                    source={{ uri: subCause.cause_repeat_icon }}
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text style={styles.subSectionTitle}>
                                                {subCause.cause_repeat_title?.[currentLanguage]}
                                            </Text>
                                        </View>
                                        <Text style={styles.subSectionDescription}>
                                            {subCause.cause_repeat_description?.[currentLanguage]}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                );
            case 'symptoms':
                return (
                    <ScrollView style={styles.tabContent}>
                        <Text style={styles.title}>{diseaseData.symptoms_tab_title?.[currentLanguage]}</Text>

                        {diseaseData.symptoms?.map((symptom, index) => (
                            <View key={index} style={styles.diseasesRepeatSection}>
                                <View style={styles.headerWithIcon}>
                                    {symptom.symptoms_icon && (
                                        <Image
                                            source={{ uri: symptom.symptoms_icon }}
                                            style={styles.icon}
                                        />
                                    )}
                                    <Text style={styles.sectionTitle}>{symptom.symptoms_title?.[currentLanguage]}</Text>
                                </View>
                                <Text style={styles.description}>{symptom.symptoms_para?.[currentLanguage]}</Text>
                                <Text style={styles.brief}>{symptom.symptoms_brief?.[currentLanguage]}</Text>

                                {symptom.symptoms_repeat?.map((subSymptom, subIndex) => (
                                    <View key={subIndex} style={styles.subSection}>
                                        <View style={styles.headerWithIcon}>
                                            {subSymptom.symptoms_repeat_icon && (
                                                <Image
                                                    source={{ uri: subSymptom.symptoms_repeat_icon }}
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text style={styles.subSectionTitle}>
                                                {subSymptom.symptoms_repeat_title?.[currentLanguage]}
                                            </Text>
                                        </View>
                                        <Text style={styles.subSectionDescription}>
                                            {subSymptom.symptoms_repeat_description?.[currentLanguage]}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                );
            case 'prevention':
                return (
                    <ScrollView style={styles.tabContent}>
                        <Text style={styles.title}>{diseaseData.prevention_tips_tab_title?.[currentLanguage]}</Text>

                        {diseaseData.prevention_tips?.map((tip, index) => (
                            <View key={index} style={styles.diseasesRepeatSection}>
                                <View style={styles.headerWithIcon}>
                                    {tip.prevention_tips_icon && (
                                        <Image
                                            source={{ uri: tip.prevention_tips_icon }}
                                            style={styles.icon}
                                        />
                                    )}
                                    <Text style={styles.sectionTitle}>{tip.prevention_tips_title?.[currentLanguage]}</Text>
                                </View>
                                <Text style={styles.description}>{tip.prevention_tips_para?.[currentLanguage]}</Text>
                                <Text style={styles.brief}>{tip.prevention_tips_brief?.[currentLanguage]}</Text>

                                {tip.prevention_tips_repeat?.map((subTip, subIndex) => (
                                    <View key={subIndex} style={styles.subSection}>
                                        <View style={styles.headerWithIcon}>
                                            {subTip.prevention_tips_repeat_icon && (
                                                <Image
                                                    source={{ uri: subTip.prevention_tips_repeat_icon }}
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text style={styles.subSectionTitle}>
                                                {subTip.prevention_tips_repeat_title?.[currentLanguage]}
                                            </Text>
                                        </View>
                                        <Text style={styles.subSectionDescription}>
                                            {subTip.prevention_tips_repeat_description?.[currentLanguage]}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                );
            case 'treatment':
                return (
                    <ScrollView style={styles.tabContent}>
                        <Text style={styles.title}>{diseaseData.treatment_option_tab_title?.[currentLanguage]}</Text>

                        {diseaseData.treatment_option?.map((option, index) => (
                            <View key={index} style={styles.diseasesRepeatSection}>
                                <View style={styles.headerWithIcon}>
                                    {option.treatment_option_icon && (
                                        <Image
                                            source={{ uri: option.treatment_option_icon }}
                                            style={styles.icon}
                                        />
                                    )}
                                    <Text style={styles.sectionTitle}>{option.treatment_option_title?.[currentLanguage]}</Text>
                                </View>
                                <Text style={styles.description}>{option.treatment_option_para?.[currentLanguage]}</Text>
                                <Text style={styles.brief}>{option.treatment_option_brief?.[currentLanguage]}</Text>

                                {option.treatment_option_repeat?.map((subOption, subIndex) => (
                                    <View key={subIndex} style={styles.subSection}>
                                        <View style={styles.headerWithIcon}>
                                            {subOption.treatment_option_repeat_icon && (
                                                <Image
                                                    source={{ uri: subOption.treatment_option_repeat_icon }}
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text style={styles.subSectionTitle}>
                                                {subOption.treatment_option_repeat_title?.[currentLanguage]}
                                            </Text>
                                        </View>
                                        <Text style={styles.subSectionDescription}>
                                            {subOption.treatment_option_repeat_description?.[currentLanguage]}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'what_is', title: diseaseData.what_is_disease_tab_title?.[currentLanguage] },
        { id: 'causes', title: diseaseData.common_cause_tab_title?.[currentLanguage] },
        { id: 'symptoms', title: diseaseData.symptoms_tab_title?.[currentLanguage] },
        { id: 'prevention', title: diseaseData.prevention_tips_tab_title?.[currentLanguage] },
        { id: 'treatment', title: diseaseData.treatment_option_tab_title?.[currentLanguage] },
    ];

    return (
        <View style={styles.container}>

            <View style={styles.sectionContainer}>
                <View style={styles.textContainer}>
                    <Text>
                        <GradientText text={diseaseData.disease_title?.[currentLanguage]} size={22} />
                    </Text>
                    <Text>{diseaseData.disease_description?.[currentLanguage]}</Text>
                </View>
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: diseaseData.disease_icon }}
                        style={styles.diseaseIcon}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabBarContainer}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <LinearGradient
                            colors={activeTab === tab.id ? ['#56235E', '#C1392D'] : ['#f5f5f5', '#f5f5f5']}
                            locations={[0.2081, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                                styles.tabButton,
                                activeTab === tab.id && styles.activeTabButton
                            ]}
                        >
                            <Text style={[
                                styles.tabButtonText,
                                activeTab === tab.id && styles.activeTabButtonText
                            ]}>
                                {tab.title}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {renderTabContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: 15,
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
    },
    mainImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    diseaseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabBarContainer: {
        paddingVertical: 8,
        gap: 10,
    },
    tabButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    activeTabButton: {
        backgroundColor: '#5A227E',
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activeTabButtonText: {
        color: '#fff',
    },
    tabContent: {
        flex: 1,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#444',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
        color: '#666',
    },
    brief: {
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 10,
        color: '#666',
    },
    subSection: {
        marginLeft: 10,
        marginBottom: 15,
    },
    subSectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 5,
        color: '#444',
    },
    subSectionDescription: {
        fontSize: 13,
        lineHeight: 18,
        color: '#666',
    },
    headerWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    imagesGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    imageCard: {
        width: '48.5%',
        aspectRatio: 1 / 0.6,
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    diseasesRepeatSection: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});

export default SingleDisease;