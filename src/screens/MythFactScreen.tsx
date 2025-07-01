import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Layout } from '../common/Layout';
import GradientText from '../common/GradientText';
import { useGetMythsAndFactsQuery } from '../store/services/mythsfacts/mythfactApi';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import { AppError } from '../common/AppError';

export default function MythFactScreen() {
    const { i18n } = useTranslation();
    const lang = i18n.language as 'en' | 'kn';
    const { data, isLoading, error, refetch } = useGetMythsAndFactsQuery({ page: 1, lang });
    const item = data?.result?.[0];

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error || !item) {
        return <AppError onRetry={refetch} />;
    }

    return (
        <Layout>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.textSection}>
                        <GradientText
                            text={item.myth_fact_title?.[lang] ?? ''}
                            size={22}
                            colors={['#5E346D', '#C13439']}
                        />
                        <Text style={styles.bodyText}>
                            {item.myth_fact_body?.[lang]}
                        </Text>
                    </View>
                    {item.myth_fact_image && (
                        <Image
                            source={{ uri: item.myth_fact_image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                </View>


                {item.facts?.map((block, idx) => {
                    const headingText = block.heading?.[lang] ?? '';
                    const wrongs = block.myths_facts_wrong_fact ?? [];
                    const rights = block.myths_facts_right_fact ?? [];
                    return (
                        <View key={idx} style={styles.factBlock}>
                            <Text style={styles.sectionHeading}>
                                {headingText}
                            </Text>
                            <Text>Myths</Text>
                            <LinearGradient
                                colors={['#F8E4FF', '#FFD7D8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.listContainer, styles.wrongContainer]}
                            >
                                {wrongs.map((w, i) => (
                                    <View key={i} style={styles.factRow}>
                                        <Entypo name="cross" size={20} color="#FF473E" />
                                        
                                        <Text style={styles.factText}>
                                            {w[lang]}
                                        </Text>
                                    </View>
                                ))}
                            </LinearGradient>
                             <Text>Facts</Text>
                            <LinearGradient
                                colors={['#E0FAFF', '#F8E2FF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.listContainer, styles.rightContainer]}
                            >
                                {rights.map((r, i) => (
                                    <View key={i} style={styles.factRow}>
                                        <Entypo name="check" size={20} color="#34A853" />
                                        <Text style={styles.factText}>
                                            {r[lang]}
                                        </Text>
                                    </View>
                                ))}
                            </LinearGradient>
                        </View>
                    );
                })}
            </ScrollView>
        </Layout>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'center',
    },
    textSection: {
        flex: 1,
    },
    bodyText: {
        fontSize: 16,
        color: '#5A5A5A',
        marginTop: 8,
        lineHeight: 22,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginLeft: 12,
    },
    factBlock: {
        marginBottom: 24,
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#56235E',
        marginBottom: 12,
    },
    listContainer: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    wrongContainer: {
        backgroundColor: '#FEE2E2',
    },
    rightContainer: {
        backgroundColor: '#DCFCE7',
    },
    factRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    factText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        marginLeft: 8,
    },
});
