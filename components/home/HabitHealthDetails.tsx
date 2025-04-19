import React from 'react'
import {
    ScrollView,
    View,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useGetSingleHabitHealthQuery } from '../../store/services/habithealth/habithealthApi'
import Back from '../../resuable/BackButton'



const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function HabitHealthDetails() {
    const route = useRoute()
    const { id } = route.params
    const { i18n } = useTranslation()
    const lang = i18n.language

    const { data, isLoading, error } = useGetSingleHabitHealthQuery({ id, lang })

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
    if (error || !data?.data) {
        return (
            <View style={styles.center}>
                <Text>Error loading details.</Text>
            </View>
        )
    }


    const item = data.data

    console.log(data)

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Back />

            <View>
                <Text style={styles.sectionTitle}>
                    {item.habits_health_heading[lang]}
                </Text>
                <Image
                    source={{ uri: item.habits_health_icon }}
                    style={styles.sectionIcon}
                />
                <Text style={styles.paragraph}>
                    {item.habits_health_para[lang]}
                </Text>
            </View>

            <Text style={styles.subTitle}>
                {item.habit_health_inner_title[lang]}
            </Text>

            {item.habit_health_inner_repeater.map((rep, i) => (
                <View key={i} style={styles.bulletRow}>
                    <Image
                        source={{ uri: rep.habit_health_suggesion_icon }}
                        style={styles.bulletIcon}
                    />
                    <Text style={styles.bulletText}>
                        {rep.habit_health_suggesion_para[lang]}
                    </Text>
                </View>
            ))}




            <View>
                <View>
                    <Text style={styles.subTitle}>
                        {item.bad_habits_health_title[lang]}
                    </Text>
                    <Text style={styles.paragraph}>
                        {item.bad_habits_health_para[lang]}
                    </Text>
                    <Image
                        source={{ uri: item.bad_habits_health_icon }}
                        style={styles.bulletIcon}
                    />

                </View>


                <View>

                    {item.bad_habits_health_repeater.map((rep, i) => (
                        <View key={i} style={styles.bulletRow}>
                            <Image
                                source={{ uri: rep.bad_habits_repeater_icon }}
                                style={styles.bulletIcon}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.bulletText}>
                                    {rep.bad_habits_repeater_heading[lang]}
                                </Text>
                                <Text style={styles.smallText}>
                                    {rep.bad_habits_repeater_description[lang]}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

            </View>


            <View>
                <View>
                    <Text style={styles.subTitle}>
                        {item.improve_health_habits_title[lang]}
                    </Text>

                    <Text style={styles.paragraph}>
                        {item.improve_health_habits_description[lang]}
                    </Text>

                    <Image
                        source={{ uri: item.improve_health_habits_icon }}
                        style={styles.bulletIcon}
                    />

                </View>

                <View>
                    {item.improve_habits_health_repeater.map((rep, i) => (
                        <View key={i} style={styles.bulletRow}>
                            <Image
                                source={{ uri: rep.improve_habits_repeater_icon }}
                                style={styles.bulletIcon}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.bulletText}>
                                    {rep.improve_habits_repeater_heading[lang]}
                                </Text>
                                <Text style={styles.smallText}>
                                    {rep.improve_habits_repeater_description[lang]}
                                </Text>
                            </View>
                        </View>
                    ))}

                </View>

            </View>




        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: SCREEN_WIDTH - 32,
        height: 200,
        borderRadius: 12,
        alignSelf: 'center',
    },
    mainTitle: {
        marginTop: 12,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        marginVertical: 12,
        lineHeight: 22,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionIcon: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bulletIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
        marginTop: 2,
    },
    bulletText: {
        flex: 1,
        fontSize: 16,
    },
    smallText: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
})
