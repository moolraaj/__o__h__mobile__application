import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useGetSingleHabitHealthQuery } from '../../store/services/habithealth/habithealthApi';
import GradientText from '../../common/GradientText';
import { AppError } from '../../common/AppError';
import RenderHtml from 'react-native-render-html';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HabitHealthDetails() {
    const { id } = useRoute().params as { id: string };
    const { i18n } = useTranslation();
    const lang = i18n.language;
    const { width } = useWindowDimensions();

    const { data, isLoading, error, refetch } = useGetSingleHabitHealthQuery(
        { id, lang },
        { refetchOnMountOrArgChange: true }
    );
    const response = data?.result || {};

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6e3b7a" />
            </View>
        );
    }
    if (error || !data) {
        return <AppError onRetry={refetch} />;
    }

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
                            text={response.habit_health_main_title?.[lang] ?? ''}
                            size={20}
                        />
                    </View>
                </View>
                <View style={styles.iconContainer}>
                    <Icon name="heart-pulse" size={30} color="#6e3b7a" />
                </View>
            </LinearGradient>

            {/* Content Sections */}
            <View>
                {response.habit_health_repeater?.map((ele, idx) => {
                    const htmlArray = ele.description?.map(f => f[lang]) ?? [];
                    const htmlContent = htmlArray.join('');
                    if (!htmlContent) return null;

                    return (
                        <View key={ele._id ?? idx} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Icon
                                    name="information-outline"
                                    size={28}
                                    color="#6e3b7a"
                                    style={styles.cardIcon}
                                />
                                {ele.title?.[lang] && (
                                    <Text style={styles.cardTitle}>
                                        {ele.title?.[lang]}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.htmlWrapper}>
                                <RenderHtml
                                    contentWidth={width - 40}
                                    source={{ html: htmlContent }}
                                    baseStyle={styles.htmlContent}
                                    tagsStyles={{
                                        h1: styles.htmlH1,
                                        h2: styles.htmlH2,
                                        h3: styles.htmlH3,
                                        h4: styles.htmlH4,
                                        h5: styles.htmlH5,
                                        h6: styles.htmlH6,
                                        p: styles.htmlP,
                                        strong: styles.htmlStrong,
                                        ul: styles.htmlUl,
                                        ol: styles.htmlOl,
                                        li: styles.htmlLi,
                                        a: styles.htmlLink,
                                    }}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    headerContent: {
        flex: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: 'rgba(110, 59, 122, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardIcon: {
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#56235E',
    },
    htmlWrapper: {
        marginTop: 8,
    },
    htmlContent: {
        padding: 4,
    },
    // Headings
    htmlH1: {
        fontSize: 25,
        fontWeight: '700',
        marginVertical: 12,
        color: '#56235E',
        lineHeight: 28,
    },
    htmlH2: {
        fontSize: 24,
        fontWeight: '600',
        marginVertical: 10,
        color: '#6e3b7a',
        lineHeight: 26,
    },
    htmlH3: {
        fontSize: 23,
        fontWeight: '600',
        marginVertical: 8,
        color: '#6e3b7a',
        lineHeight: 24,
    },
    htmlH4: {
        fontSize: 22,
        fontWeight: '500',
        marginVertical: 6,
        color: '#8e5a9b',
        lineHeight: 22,
    },
    htmlH5: {
        fontSize: 21,
        fontWeight: '500',
        marginVertical: 4,
        color: '#8e5a9b',
        lineHeight: 20,
    },
    htmlH6: {
        fontSize: 20,
        fontWeight: '500',
        marginVertical: 2,
        color: '#8e5a9b',
        lineHeight: 18,
    },
    // Paragraphs & text
    htmlP: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        marginBottom: 12,
    },
    htmlStrong: {
        fontWeight: 'bold',
        color: '#56235E',
    },
    htmlLink: {
        color: '#6e3b7a',
        textDecorationLine: 'underline',
    },
    // Lists
    htmlUl: {
        marginVertical: 8,
        paddingLeft: 20,
    },
    htmlOl: {
        marginVertical: 8,
        paddingLeft: 20,
    },
    htmlLi: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 6,
        color: '#555',
    },
});
