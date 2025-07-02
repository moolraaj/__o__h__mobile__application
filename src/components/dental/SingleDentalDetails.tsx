import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { useGetSingleDentalEmergencyQuery } from '../../store/services/dental_emergency/dentalEmergencyApi';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import GradientText from '../../common/GradientText';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { AppError } from '../../common/AppError';

const SingleDentalEmergencyDetail = () => {
    const { id } = useRoute().params as { id: string };
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language as keyof Language;
    const [expandedTab, setExpandedTab] = useState<string | null>(null);

    const { data, isLoading, error, refetch } = useGetSingleDentalEmergencyQuery({ id });

    const toggleTab = (tabIndex: string) => {
        setExpandedTab(prev => prev === tabIndex ? null : tabIndex);
    };


    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7E57C2" />
            </View>
        );
    }

    if (error || !data) {
        return <AppError onRetry={() => refetch()} />;
    }

    const emergency = data?.result;

    return (
        <ScrollView
            style={styles.container}
        >
            {/* Hero Section */}
            <LinearGradient
                colors={['#F8E4FF', '#FFD7D8']}
                locations={[0.2081, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sectionContainer}
            >
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
            </LinearGradient>

            {/* Main Content */}
            <View>
                {/* Overview Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Icon name="tooth" size={18} color="#56235E" />
                        </View>
                        <Text style={styles.cardTitle}>
                            <GradientText text={emergency?.dental_emergency_inner_title?.[currentLanguage]} size={20} />
                        </Text>
                    </View>
                    <Text style={styles.cardBody}>
                        {emergency?.dental_emergency_inner_para?.[currentLanguage]}
                    </Text>
                </View>

                {/* Emergency Details Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <AntDesign name="exclamationcircleo" size={18} color="#C1392D" />
                        </View>
                        <Text style={styles.cardTitle}>
                            <GradientText text={emergency?.dental_emer_title?.[currentLanguage]} size={20} />
                        </Text>
                    </View>

                    <Text style={styles.emergencySubtitle}>
                        {emergency?.dental_emer_sub_title?.[currentLanguage]}
                    </Text>

                    {/* Accordion Sections */}
                    {emergency?.dental_emer_repeater?.map((item, index) => {
                        const tabKey = index.toString();
                        const isExpanded = expandedTab === tabKey;
                        const questionText = item.dental_emer_tab_title?.[currentLanguage] || '';

                        return (
                            <View style={styles.accordionContainer} key={index}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => toggleTab(tabKey)}
                                >
                                    <LinearGradient
                                        colors={isExpanded ? ['#6e3b7a', '#8e5a9b'] : ['#E8F4FF', '#DDEFFF']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[
                                            styles.accordionHeader,
                                            isExpanded && styles.accordionHeaderActive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.accordionTitle,
                                                isExpanded && styles.accordionTitleActive,
                                            ]}
                                            numberOfLines={2}>
                                            {questionText}
                                        </Text>
                                        <View style={[styles.questionIcon, isExpanded && styles.questionIconActive]}>
                                            <Entypo
                                                name={isExpanded ? 'minus' : 'plus'}
                                                size={18}
                                                color={isExpanded ? '#fff' : '#5D3FD3'}
                                            />
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.accordionContent}>
                                        {item.denatl_emer_description_repeater?.map((desc, descIndex) => (
                                            <View key={descIndex} style={styles.descriptionItem}>
                                                {desc.denatl_emer_tab_heading?.[currentLanguage] && (
                                                    <Text style={styles.descriptionHeading}>
                                                        {desc.denatl_emer_tab_heading?.[currentLanguage]}
                                                    </Text>
                                                )}
                                                <Text style={styles.descriptionText}>
                                                    {desc.denatl_emer_tab_paragraph?.[currentLanguage]}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Emergency Action Card */}
                {/* <View style={[styles.card, styles.emergencyActionCard]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Icon name="phone-alt" size={18} color="#FF5252" />
                        </View>
                        <Text style={styles.cardTitle}>Emergency Action</Text>
                    </View>
                    <Text style={styles.cardBody}>
                        If you're experiencing severe pain or bleeding that won't stop,
                        contact your dentist immediately or visit the nearest emergency dental clinic.
                    </Text>
                    <TouchableOpacity style={styles.emergencyButton}>
                        <Text style={styles.emergencyButtonText}>Find Nearest Clinic</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </ScrollView>
    );
};

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
        lineHeight: 25,
        marginBottom: 20,
        color: '#555',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContainer: {
        marginBottom: 20,
    },
    heroGradient: {
        borderRadius: 16,
        padding: 20,
        shadowColor: '#7E57C2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroTextContainer: {
        flex: 1,
        paddingRight: 15,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        marginBottom: 8,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 22,
    },
    heroIconContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 70,
        height: 70,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroIcon: {
        width: 40,
        height: 40,
        tintColor: 'white',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#808080',
        margin: 2,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 18,
        backgroundColor: '#F3E5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#424242',
        flex: 1,
    },
    cardBody: {
        fontSize: 15,
        lineHeight: 24,
        color: '#616161',
    },
    emergencySubtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#7E57C2',
        marginBottom: 20,
        lineHeight: 24,
    },
    accordionContainer: {
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    accordionHeader: {
        backgroundColor: '#FAFAFA',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    accordionHeaderActive: {
        backgroundColor: '#F3E5F5',
        color: '#fff',
    },
    accordionTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#424242',
        marginRight: 10,
    },
    accordionTitleActive: {
        color: '#ffffff',
    },
    questionIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionIconActive: {
        backgroundColor: 'transparent',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accordionContent: {
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    descriptionItem: {
        marginBottom: 15,
    },
    descriptionHeading: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7E57C2',
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#616161',
    },
    emergencyActionCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#FF5252',
    },
    emergencyButton: {
        backgroundColor: '#FF5252',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    emergencyButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default SingleDentalEmergencyDetail;