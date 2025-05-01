import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useGetSingleHabitHealthQuery } from '../../store/services/habithealth/habithealthApi';
import GradientText from '../../common/GradientText';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Loader from '../../common/Loader';

interface HabitHealthInnerRepeater {
    habit_health_suggesion_icon: string;
    habit_health_suggesion_para: { [key: string]: string };
}

export default function HabitHealthDetails() {
    const { id } = useRoute().params as { id: string };
    const { i18n } = useTranslation();
    const lang = i18n.language;
    const { data, isLoading, error } = useGetSingleHabitHealthQuery({ id, lang });

    if (isLoading || error || !data?.data) {
        return (
            <View style={styles.center}>
                <Loader />
                {error && <Text>Error loading details.</Text>}
            </View>
        );
    }

    const { data: item } = data;

    const renderMaskedText = (text: any, colors: string[]) => (
        <MaskedView maskElement={<Text style={[styles.bulletText, { backgroundColor: 'transparent' }]}>{text}</Text>}>
            <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={[styles.bulletText, { opacity: 0 }]}>{text}</Text>
            </LinearGradient>
        </MaskedView>
    );

    const renderBulletIcon = (uri: string) => {
        if (!uri) {
            return <FontAwesome5 name="tooth" size={22} color="#56235E" style={styles.bulletIcon} />;
        }
        return <Image source={{ uri }} style={styles.bulletIcon} />;
    };

    return (
        <View style={styles.container}>
            {/* Intro */}
            <View style={styles.section}>
                <GradientText text={item.habits_health_heading[lang]} size={22} />
                <View style={styles.row}>
                    <Text style={styles.paragraph}>{item.habits_health_para[lang]}</Text>
                    <Image source={{ uri: item.habits_health_icon }} style={styles.sectionIcon} />
                </View>
            </View>

            {/* Habits suggestions */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    {renderMaskedText(<Icon name="emoji-events" size={24} color="#4CAF50" />, ['#56235E', '#C1392D'])}
                    <Text style={styles.cardTitle}>{item.habit_health_inner_title[lang]}</Text>
                </View>
                {item.habit_health_inner_repeater.map((rep: HabitHealthInnerRepeater, i: number) => (
                    <View key={i} style={styles.bulletRow}>
                        {renderBulletIcon(rep.habit_health_suggesion_icon)}
                        {renderMaskedText(rep.habit_health_suggesion_para[lang], ['#56235E', '#C1392D'])}
                    </View>
                ))}
            </View>

            {/* Bad Habits */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    {renderMaskedText(<Icon name="highlight-off" size={24} color="#FF5722" />, ['#1E90FF', '#FF69B4'])}
                    <Text style={styles.cardTitle}>{item.bad_habits_health_title[lang]}</Text>
                </View>
                <Text style={styles.cardSubtitle}>{item.bad_habits_health_para[lang]}</Text>
                {item.bad_habits_health_repeater.map((rep: {
                    bad_habits_repeater_icon: string;
                    bad_habits_repeater_heading: { [key: string]: string };
                    bad_habits_repeater_description: { [key: string]: string };
                }, i: number) => (
                    <View key={i} style={styles.bulletRow}>
                        {renderBulletIcon(rep.bad_habits_repeater_icon)}
                        <View style={{ flex: 1 }}>
                            {renderMaskedText(rep.bad_habits_repeater_heading[lang], ['#1E90FF', '#FF69B4'])}
                            <Text style={styles.smallText}>{rep.bad_habits_repeater_description[lang]}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Tips to Improve */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    {renderMaskedText(<Icon name="lightbulb" size={24} color="#FFC107" />, ['#4CAF50', '#8E24AA'])}
                    <Text style={styles.cardTitle}>{item.improve_health_habits_title[lang]}</Text>
                </View>
                <Text style={styles.cardSubtitle}>{item.improve_health_habits_description[lang]}</Text>
                {item.improve_habits_health_repeater.map((rep: {
                    improve_habits_repeater_icon: string;
                    improve_habits_repeater_heading: { [key: string]: string };
                    improve_habits_repeater_description: { [key: string]: string };
                }, i: number) => (
                    <View key={i} style={styles.bulletRow}>
                        {renderBulletIcon(rep.improve_habits_repeater_icon)}
                        <View style={{ flex: 1 }}>
                            {renderMaskedText(rep.improve_habits_repeater_heading[lang], ['#4CAF50', '#8E24AA'])}
                            <Text style={styles.smallText}>{rep.improve_habits_repeater_description[lang]}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
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
    section: {
        marginBottom: 15,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20
    },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    paragraph: {
        fontSize: 16,
        color: '#A1A8B0',
        letterSpacing: 0.2,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 4,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },
    cardSubtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 12,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1.5,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
    },
    bulletIcon: {
        width: 28,
        height: 28,
        marginRight: 12,
        marginTop: 2,
        borderRadius: 12,
    },
    bulletText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444',
    },
    smallText: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },
});
