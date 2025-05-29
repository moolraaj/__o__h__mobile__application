import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { Layout } from '../common/Layout';
import GradientText from '../common/GradientText';
import { useGetMythsAndFactsQuery } from '../store/services/mythsfacts/mythfactApi';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import { AppError } from '../common/AppError';

export default function MythFactScreen() {
    const { i18n } = useTranslation();
    const lang = i18n.language as keyof Language;
    const { data, isLoading, error, refetch } = useGetMythsAndFactsQuery({ page: 1, lang });

    const item = data?.result?.[0];

    return (
        <Layout>
            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : error || !data ? (
                <AppError onRetry={() => refetch()} />
            ) : (
                <View style={styles.container}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.textSection}>
                            <GradientText text={item?.myth_fact_title?.[lang]} size={22} colors={["#5E346D", "#C13439"]} />
                            <Text style={styles.bodyText}>{item?.myth_fact_body?.[lang]}</Text>
                        </View>
                        {item?.myth_fact_image && (
                            <Image
                                source={{ uri: item.myth_fact_image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        )}
                    </View>

                    {/* Heading & Description */}
                    <Text style={styles.heading}>{item?.myth_fact_heading?.[lang]}</Text>
                    <Text style={styles.description}>{item?.myth_fact_description?.[lang]}</Text>

                    {/* Myths */}
                    <LinearGradient
                        colors={['#F8E4FF', '#FFD7D8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.mythBox}>
                        {item?.myths_facts_wrong_fact?.map((wrong, index) => (
                            <View key={index} style={styles.factRow}>
                                <Entypo name="cross" color="#FF473E" size={24} style={styles.icon} />
                                <Text style={styles.factText}>{wrong[lang]}</Text>
                            </View>
                        ))}
                    </LinearGradient>

                    {/* Facts */}
                    <LinearGradient
                        colors={['#E0FAFF', '#F8E2FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.factBox}>
                        {item?.myths_facts_right_fact?.map((right, index) => (
                            <View key={index} style={styles.factRow}>
                                <Entypo name="check" color="#34A853" size={22} style={styles.icon} />
                                <Text style={styles.factText}>{right[lang]}</Text>
                            </View>
                        ))}
                    </LinearGradient>
                </View>
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    textSection: {
        alignItems: 'flex-start',
        flex: 1,
    },
    bodyText: {
        fontSize: 16,
        color: '#5A5A5A',
        marginTop: 8,
        lineHeight: 22
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 12,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#800080',
        marginBottom: 4,
    },
    description: {
        fontSize: 15,
        color: '#5A5A5A',
        marginBottom: 16,
        lineHeight: 22
    },
    mythBox: {
        backgroundColor: '#FEE2E2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    factBox: {
        backgroundColor: '#DCFCE7',
        padding: 16,
        borderRadius: 12,
    },
    factRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: 5,
        marginTop: 2
    },
    factText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
        paddingBottom: 10,
        lineHeight: 22
    },
});