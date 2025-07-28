import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGetSingleDiseasesQuery } from '../store/services/disease/diseaseApi';
import { useTranslation } from 'react-i18next';
import GradientText from '../common/GradientText';
import { AppError } from '../common/AppError';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RenderHtml from 'react-native-render-html';
import { DISEASE_ICON_SIZE } from '../constants/Variables';

const SingleDisease = () => {
    const WRONG = 'No data available for this section'
    const { id } = useRoute().params as { id: string };
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language as keyof Language;
    const { width } = useWindowDimensions();
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





    const htmlRenderStyles = {

        h1: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 20,
            marginBottom: 15,
            lineHeight: 30,
        },
        h2: {
            fontSize: 22,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 18,
            marginBottom: 14,
            lineHeight: 28,
        },
        h3: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 16,
            marginBottom: 12,
            lineHeight: 26,
        },
        h4: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 14,
            marginBottom: 10,
            lineHeight: 24,
        },
        h5: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 12,
            marginBottom: 8,
            lineHeight: 22,
        },
        h6: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 10,
            marginBottom: 6,
            lineHeight: 20,
        },

        p: {
            fontSize: 14,
            lineHeight: 20,
            color: '#666',
            marginBottom: 8,
        },
        ul: {
            marginTop: 0,
            marginBottom: 0,
        },
        ol: {
            marginTop: 0,
            marginBottom: 0,
        },
        li: {
            marginBottom: 4,
        },
        a: {
            color: '#6e3b7a',
            textDecorationLine: 'underline',
        },

        strong: {
            fontWeight: 'bold',
        },
        em: {
            fontStyle: 'italic',
        },
        blockquote: {
            backgroundColor: '#f9f5fa',
            borderLeftWidth: 4,
            borderLeftColor: '#6e3b7a',
            paddingLeft: 12,
            marginVertical: 10,
        },
        pre: {
            backgroundColor: '#f5f5f5',
            padding: 10,
            borderRadius: 4,
            overflow: 'hidden',
        },
        code: {
            fontFamily: 'monospace',
            backgroundColor: '#f5f5f5',
            padding: 2,
            borderRadius: 3,
        },
        img: {
            maxWidth: width - 40,
            height: undefined,
            aspectRatio: 1,
            resizeMode: 'contain',
            marginVertical: 10,
        }
    };

    return (
        <ScrollView style={styles.container}>

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
                {diseaseData.common_cause.length > 0 ? (diseaseData.common_cause?.map((cause, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            {cause.cause_icon ? (
                                <Image
                                    source={{ uri: cause.cause_icon }}
                                    style={styles.cardIcon}
                                />
                            ) : (
                                <Icon name="alert-circle" size={DISEASE_ICON_SIZE} color="#6e3b7a" style={styles.cardIcon} />
                            )}
                            <Text style={styles.itemTitle}>
                                {cause.cause_title?.[currentLanguage] === '' ? (<Text style={styles.error_section}>{WRONG}</Text>) : cause.cause_title?.[currentLanguage]}
                            </Text>
                        </View>

                        {cause.cause_para && (
                            <RenderHtml
                                contentWidth={width - 40}
                                source={{ html: cause.cause_para?.[currentLanguage] || '' }}
                                tagsStyles={htmlRenderStyles}
                            />
                        )}

                        {cause.cause_repeater?.map((subCause, subIndex) => (
                            <View key={subIndex} style={styles.cardItem}>
                                <View style={styles.itemHeader}>

                                    <Text style={styles.itemTitle}>
                                        {subCause.cause_repeat_title?.[currentLanguage]}
                                    </Text>
                                </View>
                                <RenderHtml
                                    contentWidth={width - 60}
                                    source={{ html: subCause.description?.[currentLanguage] || '' }}
                                    tagsStyles={htmlRenderStyles}
                                />
                            </View>
                        ))}
                    </View>
                ))) : (
                    <>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.error_section}>{WRONG}</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

            {/* Symptoms Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    <GradientText text={diseaseData.symptoms_tab_title?.[currentLanguage]} size={18} />
                </Text>
                {diseaseData.symptoms.length > 0 ? (diseaseData.symptoms?.map((symptom, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>

                            {symptom.symptom_tips_icon ? (
                                <Image
                                    source={{ uri: tip.prevention_tips_icon }}
                                    style={styles.cardIcon}
                                />
                            ) : (
                                <Icon name="shield-check" size={DISEASE_ICON_SIZE} color="#6e3b7a" style={styles.cardIcon} />
                            )}

                            <Text style={styles.itemTitle}>

                                {symptom.symptoms_title?.[currentLanguage] === '' ? (<Text style={styles.error_section}>{WRONG}</Text>) : symptom.symptoms_title?.[currentLanguage]}

                            </Text>
                        </View>

                        {symptom.symptoms_para && (
                            <RenderHtml
                                contentWidth={width - 40}
                                source={{ html: symptom.symptoms_para?.[currentLanguage] || '' }}
                                tagsStyles={htmlRenderStyles}
                            />
                        )}

                        {symptom.symptoms_repeater?.map((subSymptom, subIndex) => (
                            <View key={subIndex} style={styles.cardItem}>
                                <View style={styles.itemHeader}>

                                    <Text style={styles.itemTitle}>
                                        {subSymptom.symptoms_repeat_title?.[currentLanguage]}
                                    </Text>
                                </View>
                                <RenderHtml
                                    contentWidth={width - 60}
                                    source={{ html: subSymptom.description?.[currentLanguage] || '' }}
                                    tagsStyles={htmlRenderStyles}
                                />
                            </View>
                        ))}
                    </View>
                ))) : (
                    <>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.error_section}>{WRONG}</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

            {/* Prevention Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    <GradientText text={diseaseData.prevention_tips_tab_title?.[currentLanguage]} size={18} />
                </Text>
                {diseaseData.prevention_tips.length > 0 ? (diseaseData.prevention_tips?.map((tip, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            {tip.prevention_tips_icon ? (
                                <Image
                                    source={{ uri: tip.prevention_tips_icon }}
                                    style={styles.cardIcon}
                                />
                            ) : (
                                <Icon name="shield-check" size={DISEASE_ICON_SIZE} color="#6e3b7a" style={styles.cardIcon} />
                            )}
                            <Text style={styles.itemTitle}>
                                {tip.prevention_tips_title?.[currentLanguage] === '' ? (<Text style={styles.error_section}>{WRONG}</Text>) : tip.prevention_tips_title?.[currentLanguage]}
                            </Text>
                        </View>

                        {tip.prevention_tips_para && (
                            <RenderHtml
                                contentWidth={width - 40}
                                source={{ html: tip.prevention_tips_para?.[currentLanguage] || '' }}
                                tagsStyles={htmlRenderStyles}
                            />
                        )}

                        {tip.prevention_tips_repeater?.map((subTip, subIndex) => (
                            <View key={subIndex} style={styles.cardItem}>
                                <View style={styles.itemHeader}>

                                    <Text style={styles.itemTitle}>
                                        {subTip.prevention_tips_repeat_title?.[currentLanguage]}
                                    </Text>
                                </View>
                                <RenderHtml
                                    contentWidth={width - 60}
                                    source={{ html: subTip.description?.[currentLanguage] || '' }}
                                    tagsStyles={htmlRenderStyles}
                                />
                            </View>
                        ))}
                    </View>
                ))) : <>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.error_section}>{WRONG}</Text>
                        </View>
                    </View>
                </>}
            </View>

            {/* Treatment Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    <GradientText text={diseaseData.treatment_option_tab_title?.[currentLanguage]} size={18} />
                </Text>
                {diseaseData.treatment_option.length > 0 ? (diseaseData.treatment_option?.map((option, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            {option.treatment_option_icon ? (
                                <Image
                                    source={{ uri: option.treatment_option_icon }}
                                    style={styles.cardIcon}
                                />
                            ) : (
                                <Icon name="medical-bag" size={DISEASE_ICON_SIZE} color="#6e3b7a" style={styles.cardIcon} />
                            )}
                            <Text style={styles.itemTitle}>

                                {option.treatment_option_title?.[currentLanguage] === '' ? (<Text style={styles.error_section}>{WRONG}</Text>) : option.treatment_option_title?.[currentLanguage]}

                            </Text>
                        </View>

                        {option.treatment_option_para && (
                            <RenderHtml
                                contentWidth={width - 40}
                                source={{ html: option.treatment_option_para?.[currentLanguage] || '' }}
                                tagsStyles={htmlRenderStyles}
                            />
                        )}

                        {option.treatment_option_repeater?.map((subOption, subIndex) => (
                            <View key={subIndex} style={styles.cardItem}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>
                                        {subOption.treatment_option_repeat_title?.[currentLanguage]}
                                    </Text>
                                </View>
                                <RenderHtml
                                    contentWidth={width - 60}
                                    source={{ html: subOption.description?.[currentLanguage] || '' }}
                                    tagsStyles={htmlRenderStyles}
                                />
                            </View>
                        ))}
                    </View>
                ))) : (<>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.error_section}>{WRONG}</Text>
                        </View>
                    </View>
                </>)}
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
        alignItems: 'flex-start',

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
        flexShrink: 1,
        flexWrap: 'wrap',
        flex: 1
    },
    error_section: {
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