import React from 'react';
import {
    View,
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
                <ActivityIndicator size="large" />
            </View>
        );
    }
    if (error || !data) {
        return <AppError onRetry={refetch} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.sectionContainer}>
                <GradientText
                    text={response.habit_health_main_title?.[lang] ?? ''}
                    size={22}
                />
            </View>

            <View style={styles.htmlContainer}>
                {response.habit_health_repeater?.map((ele, idx) => {
                    const htmlArray = ele.description?.map(f => f[lang]) ?? [];
                    const htmlContent = htmlArray.join('');
                    if (!htmlContent) return null;
                    return (
                        <View key={ele._id ?? idx} style={styles.card}>
                            <RenderHtml
                                contentWidth={width}
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
                                }}
                            />
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    sectionContainer: {
        borderRadius: 12,
        padding: 15,
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
    },
    htmlContainer: { flex: 1 },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    htmlContent: { padding: 10 },

    // Headings
    htmlH1: { fontSize: 26, fontWeight: 'bold', marginVertical: 12 },
    htmlH2: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
    htmlH3: { fontSize: 20, fontWeight: '600', marginVertical: 8 },
    htmlH4: { fontSize: 18, fontWeight: '600', marginVertical: 6 },
    htmlH5: { fontSize: 16, fontWeight: '500', marginVertical: 4 },
    htmlH6: { fontSize: 14, fontWeight: '500', marginVertical: 2 },

    // Paragraphs & text
    htmlP: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 12 },
    htmlStrong: { fontWeight: 'bold' },

    // Lists
    htmlUl: { marginVertical: 8, paddingLeft: 20 },
    htmlOl: { marginVertical: 8, paddingLeft: 20 },
    htmlLi: { fontSize: 16, lineHeight: 24, marginBottom: 4 },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
