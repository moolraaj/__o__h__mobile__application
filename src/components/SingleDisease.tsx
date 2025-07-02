import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGetSingleDiseasesQuery } from '../store/services/disease/diseaseApi';
import { useTranslation } from 'react-i18next';
import GradientText from '../common/GradientText';
import { AppError } from '../common/AppError';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SingleDisease = () => {
    const { id } = useRoute().params as { id: string };
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language as keyof Language;
    const { data, isLoading, error, refetch } = useGetSingleDiseasesQuery({ id, lang: currentLanguage },
        {
            refetchOnMountOrArgChange: true,
        });

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6e3b7a" />
            </View>
        );
    }
    if (error || !data) {
        return <AppError onRetry={() => refetch()} />;
    }

    const diseaseData = data.data;

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <LinearGradient
                colors={['#f9f5fa', '#f0e5f5']}
                style={styles.headerContainer}
            >
                <View style={styles.headerContent}>
                    <View style={styles.textTitle}>
                        <GradientText
                            text={diseaseData.disease_title?.[currentLanguage]}
                            size={22}
                        />
                    </View>
                    <Text style={styles.diseaseDescription}>
                        {diseaseData.disease_description?.[currentLanguage]}
                    </Text>
                </View>
                <View style={styles.iconContainer}>
                    {diseaseData.disease_icon ? (
                        <Image
                            source={{ uri: diseaseData.disease_icon }}
                            style={styles.diseaseIcon}
                            resizeMode="contain"
                        />
                    ) : (
                        <Icon name="medical-bag" size={30} color="#6e3b7a" />
                    )}
                </View>
            </LinearGradient>

            {/* Causes Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    <GradientText text={diseaseData.common_cause_tab_title?.[currentLanguage]} size={18} />
                </Text>
                {diseaseData.common_cause?.map((cause, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            {cause.cause_icon ? (
                                <Image
                                    source={{ uri: cause.cause_icon }}
                                    style={styles.cardIcon}
                                />
                            ) : (
                                <Icon name="alert-circle" size={28} color="#6e3b7a" style={styles.cardIcon} />
                            )}
                        </View>

                        {cause.cause_repeat?.map((subCause, subIndex) => (
                            <View key={subIndex} style={styles.cardItem}>
                                <View style={styles.itemHeader}>
                                    {subCause.cause_repeat_icon ? (
                                        <Image
                                            source={{ uri: subCause.cause_repeat_icon }}
                                            style={styles.itemIcon}
                                        />
                                    ) : (
                                        <Icon name="chevron-right" size={20} color="#8e5a9b" style={styles.itemIcon} />
                                    )}
                                    <Text style={styles.itemTitle}>
                                        {subCause.cause_repeat_title?.[currentLanguage]}
                                    </Text>
                                </View>
                                <Text style={styles.itemText}>
                                    {subCause.cause_repeat_description?.[currentLanguage]}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Symptoms Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    <GradientText text={diseaseData.symptoms_tab_title?.[currentLanguage]} size={18} />
                </Text>
                {diseaseData.symptoms?.map((symptom, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            {symptom.symptoms_icon ? (
                                <Image
                                    source={{ uri: symptom.symptoms_icon }}
                                    style={styles.cardIcon}
                                />
                            ) : (
                                <Icon name="alert" size={28} color="#6e3b7a" style={styles.cardIcon} />
                            )}
                        </View>
                        <Text style={styles.cardText}>{symptom.symptoms_para?.[currentLanguage]}</Text>
                        {symptom.symptoms_repeat?.map((subSymptom, subIndex) => (
                            <View key={subIndex} style={styles.cardItem}>
                                <View style={styles.itemHeader}>
                                    {subSymptom.symptoms_repeat_icon ? (
                                        <Image
                                            source={{ uri: subSymptom.symptoms_repeat_icon }}
                                            style={styles.itemIcon}
                                        />
                                    ) : (
                                        <Icon name="minus" size={20} color="#8e5a9b" style={styles.itemIcon} />
                                    )}
                                    <Text style={styles.itemTitle}>
                                        {subSymptom.symptoms_repeat_title?.[currentLanguage]}
                                    </Text>
                                </View>
                                <Text style={styles.itemText}>
                                    {subSymptom.symptoms_repeat_description?.[currentLanguage]}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Prevention Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    <GradientText text={diseaseData.prevention_tips_tab_title?.[currentLanguage]} size={18} />
                </Text>
                {diseaseData.prevention_tips?.map((tip, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            {tip.prevention_tips_icon ? (
                                <Image
                                    source={{ uri: tip.prevention_tips_icon }}
                                    style={styles.cardIcon}
                                />
                            ) : (
                                <Icon name="shield-check" size={28} color="#6e3b7a" style={styles.cardIcon} />
                            )}
                        </View>
                        <Text style={styles.cardText}>{tip.prevention_tips_para?.[currentLanguage]}</Text>
                        {tip.prevention_tips_repeat?.map((subTip, subIndex) => (
                            <View key={subIndex} style={styles.cardItem}>
                                <View style={styles.itemHeader}>
                                    {subTip.prevention_tips_repeat_icon ? (
                                        <Image
                                            source={{ uri: subTip.prevention_tips_repeat_icon }}
                                            style={styles.itemIcon}
                                        />
                                    ) : (
                                        <Icon name="check" size={20} color="#8e5a9b" style={styles.itemIcon} />
                                    )}
                                    <Text style={styles.itemTitle}>
                                        {subTip.prevention_tips_repeat_title?.[currentLanguage]}
                                    </Text>
                                </View>
                                <Text style={styles.itemText}>
                                    {subTip.prevention_tips_repeat_description?.[currentLanguage]}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Treatment Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    <GradientText text={diseaseData.treatment_option_tab_title?.[currentLanguage]} size={18} />
                </Text>
                {diseaseData.treatment_option?.map((option, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            {option.treatment_option_icon ? (
                                <Image
                                    source={{ uri: option.treatment_option_icon }}
                                    style={styles.cardIcon}
                                />
                            ) : (
                                <Icon name="medical-bag" size={28} color="#6e3b7a" style={styles.cardIcon} />
                            )}
                        </View>
                        <Text style={styles.cardText}>{option.treatment_option_para?.[currentLanguage]}</Text>
                        {option.treatment_option_repeat?.map((subOption, subIndex) => (
                            <View key={subIndex} style={styles.cardItem}>
                                <View style={styles.itemHeader}>
                                    {subOption.treatment_option_repeat_icon ? (
                                        <Image
                                            source={{ uri: subOption.treatment_option_repeat_icon }}
                                            style={styles.itemIcon}
                                        />
                                    ) : (
                                        <Icon name="pill" size={20} color="#8e5a9b" style={styles.itemIcon} />
                                    )}
                                    <Text style={styles.itemTitle}>
                                        {subOption.treatment_option_repeat_title?.[currentLanguage]}
                                    </Text>
                                </View>
                                <Text style={styles.itemText}>
                                    {subOption.treatment_option_repeat_description?.[currentLanguage]}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textTitle: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        paddingLeft: 0,
        marginLeft: 0,
        marginBottom: 5,
    },
    headerContainer: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    headerContent: {
        flex: 1,
        paddingRight: 15,
    },
    diseaseTitle: {
        marginBottom: 8,
        fontWeight: '700',
    },
    diseaseDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(110, 59, 122, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    diseaseIcon: {
        width: 30,
        height: 30,
        tintColor: '#6e3b7a',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        paddingLeft: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#6e3b7a',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#6e3b7a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0e5f5',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardIcon: {
        width: 28,
        height: 28,
        marginRight: 10,
    },
    cardText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
        marginBottom: 8,
    },
    cardItem: {
        marginBottom: 8,
        paddingLeft: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#56235E',
    },
    itemText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        marginLeft: 28,
    },
});

export default SingleDisease;