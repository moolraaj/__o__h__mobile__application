import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGetSingleDiseasesQuery } from '../store/services/disease/diseaseApi';
import { useTranslation } from 'react-i18next';
import GradientText from '../common/GradientText';

const SingleDisease = ({ navigation }: { navigation: any }) => {
    const { id } = useRoute().params as { id: string };
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { data } = useGetSingleDiseasesQuery({ id, lang: currentLanguage });
    const [activeTab, setActiveTab] = useState('what_is');

    if (!data?.data) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const diseaseData = data.data;

    console.log(`diseaseData`)
    console.log(diseaseData)




    const renderTabContent = () => {
        switch (activeTab) {
            case 'what_is':
                return (
                    <ScrollView style={styles.tabContent}>
                        <Text style={styles.title}>{diseaseData.what_is_disease_tab_title?.[currentLanguage]}</Text>

                        {diseaseData.what_is_disease_repeat?.map((item, index) => (
                            <View key={index} style={styles.section}>

                                {item.what_is_disease_repeat_images?.map((imageUrl, index) => (
                                    <View key={`disease-image-${index}`} style={styles.imageContainer}>
                                        <Image
                                            source={{ uri: imageUrl }}
                                            style={styles.mainImage}
                                            resizeMode="cover"
                                            onError={() => console.log('Failed to load image:', imageUrl)}
                                        />
                                    </View>
                                ))}
                                <Text style={styles.sectionTitle}>{item.what_is_disease_heading?.[currentLanguage]}</Text>
                                <Text style={styles.description}>
                                    {item.what_is_disease_disease_repeat_description?.[currentLanguage]}
                                </Text>
                                {item.what_is_disease_heading_description_repeater?.map((subItem, subIndex) => (
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
                            <View key={index}  >
                                <View >
                                    {cause.cause_icon && (
                                        <Image
                                            source={{ uri: cause.cause_icon }}
                                            style={styles.icon}
                                        />
                                    )}
                                    <Text>{cause.cause_title?.[currentLanguage]}</Text>
                                    <Text>{cause.cause_para?.[currentLanguage]}</Text>
                                </View>



                                <Text style={styles.sectionTitle}>{cause.cause_brief?.[currentLanguage]}</Text>
                                {cause.cause_repeat?.map((subCause, subIndex) => (
                                    <View key={subIndex}>
                                        <View  >
                                            {subCause.cause_repeat_icon && (
                                                <Image
                                                    source={{ uri: subCause.cause_repeat_icon }}
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text  >
                                                {subCause.cause_repeat_title?.[currentLanguage]}
                                            </Text>
                                        </View>
                                        <Text >
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
                            <View key={index} >
                                <View>
                                    {symptom.symptoms_icon && (
                                        <Image
                                            source={{ uri: symptom.symptoms_icon }}
                                            style={styles.icon}
                                        />
                                    )}
                                    <Text>{symptom.symptoms_title?.[currentLanguage]}</Text>
                                    <Text>{symptom.symptoms_para?.[currentLanguage]}</Text>


                                    <Text>{symptom.symptoms_brief?.[currentLanguage]}</Text>
                                </View>
                                {symptom.symptoms_repeat?.map((subSymptom, subIndex) => (
                                    <View key={subIndex}  >
                                        <View  >
                                            {subSymptom.symptoms_repeat_icon && (
                                                <Image
                                                    source={{ uri: subSymptom.symptoms_repeat_icon }}
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text>
                                                {subSymptom.symptoms_repeat_title?.[currentLanguage]}
                                            </Text>
                                        </View>
                                        <Text  >
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
                            <View key={index} style={styles.section}>
                                <View >
                                    {tip.prevention_tips_icon && (
                                        <Image
                                            source={{ uri: tip.prevention_tips_icon }}
                                            style={styles.icon}
                                        />
                                    )}
                                    <Text  >{tip.prevention_tips_title?.[currentLanguage]}</Text>
                                    <Text style={styles.description}>{tip.prevention_tips_para?.[currentLanguage]}</Text>
                                </View>


                                <Text style={styles.brief}>{tip.prevention_tips_brief?.[currentLanguage]}</Text>
                                {tip.prevention_tips_repeat?.map((subTip, subIndex) => (
                                    <View key={subIndex}>
                                        <View>
                                            {subTip.prevention_tips_repeat_icon && (
                                                <Image
                                                    source={{ uri: subTip.prevention_tips_repeat_icon }}
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text>
                                                {subTip.prevention_tips_repeat_title?.[currentLanguage]}
                                            </Text>
                                        </View>
                                        <Text>
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
                            <View key={index}  >
                                <View >
                                    {option.treatment_option_icon && (
                                        <Image
                                            source={{ uri: option.treatment_option_icon }}
                                            style={styles.icon}
                                        />
                                    )}
                                    <Text>{option.treatment_option_title?.[currentLanguage]}</Text>
                                    <Text>{option.treatment_option_para?.[currentLanguage]}</Text>
                                </View>


                                <Text style={styles.brief}>{option.treatment_option_brief?.[currentLanguage]}</Text>
                                {option.treatment_option_repeat?.map((subOption, subIndex) => (
                                    <View key={subIndex}>
                                        <View>
                                            {subOption.treatment_option_repeat_icon && (
                                                <Image
                                                    source={{ uri: subOption.treatment_option_repeat_icon }}
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text>
                                                {subOption.treatment_option_repeat_title?.[currentLanguage]}
                                            </Text>
                                        </View>
                                        <Text>
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
                <View style={styles.row}>
                    <Text>
                        <GradientText text={diseaseData.disease_title?.[currentLanguage]} size={22} />
                    </Text>
                    <Text>{diseaseData.disease_description?.[currentLanguage]}</Text>
                </View>
                <View style={styles.row}>
                    <Image
                        source={{ uri: diseaseData.disease_icon }}
                        style={styles.diseaseIcon}
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
                        style={[
                            styles.tabButton,
                            activeTab === tab.id && styles.activeTabButton
                        ]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={[
                            styles.tabButtonText,
                            activeTab === tab.id && styles.activeTabButtonText
                        ]}>
                            {tab.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {renderTabContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        marginBottom: 15,
    },
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 5,
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
    diseaseIcon: {
        width: 40,
        height: 40,
        marginRight: 15,
    },
    diseaseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabBarContainer: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
    },
    activeTabButton: {
        backgroundColor: '#1e88e5',
    },
    tabButtonText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    tabContent: {
        flex: 1,
        padding: 15,
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
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#ddd',
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
});

export default SingleDisease;