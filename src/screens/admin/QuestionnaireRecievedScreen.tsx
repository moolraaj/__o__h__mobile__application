import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    Pressable
} from 'react-native';
import React, { useState } from 'react';
import { Layout } from '../../common/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import Loader from '../../common/Loader';
import { useFetchAdminAllQuestionnairesQuery, useTakeoverQuestionnaireMutation } from '../../store/services/questionnaire/questionnaireApi';

import { useAuth } from '../../navigation/AuthContext';
import { ToastMessage } from '../../resuable/Toast';


export default function QuestionReceivedList({ navigation }: { navigation: any }) {
    const { data, isLoading, error, refetch } = useFetchAdminAllQuestionnairesQuery({ page: 1 });
    const [takeoverQuestionnaire] = useTakeoverQuestionnaireMutation();

    const [modalVisible, setModalVisible] = useState(false);

    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireTypes | null>(null);

    const { user } = useAuth();

    const openModal = (item: QuestionnaireTypes) => {
        setSelectedQuestionnaire(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedQuestionnaire(null);
    };

    const handleTakeover = async (id: string) => {
        try {
            const { message } = await takeoverQuestionnaire({ id, adminId: user?.id ?? '' }).unwrap();
            ToastMessage('success', message);
            refetch();
        } catch (err: any) {
            ToastMessage('error', err.data?.message || 'Failed to takeover questionnaire');
        }
    };

    const renderModal = () => (
        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Questionnaire Details</Text>
                    {selectedQuestionnaire && (
                        <ScrollView
                            style={styles.modalScroll}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >

                            {[
                                ['Name', selectedQuestionnaire.name],
                                ['Age', selectedQuestionnaire.age?.toString()],
                                ['Gender', selectedQuestionnaire.gender],
                                ['Card Number', selectedQuestionnaire.cardNumber?.toString()],
                                ['Phone Number', selectedQuestionnaire.phoneNumber?.toString()],
                                ['Address', selectedQuestionnaire.address],
                                ['Blood Group', selectedQuestionnaire.bloodGroup],
                                ['ID Card Available', selectedQuestionnaire.idCardAvailable],
                                ['Religion', selectedQuestionnaire.religion],
                                ['Education', selectedQuestionnaire.education],
                                ['Occupation', selectedQuestionnaire.occupation],
                                ['Income', selectedQuestionnaire.income?.toString()],
                                ['Family History', selectedQuestionnaire.familyHistory],
                                ['First-degree Relative with Oral Cancer', selectedQuestionnaire.firstDegreeRelativeOralCancer],
                                ['Height', selectedQuestionnaire.height?.toString()],
                                ['Diabetes', selectedQuestionnaire.diabetes ? 'Yes' : 'No'],
                                ['Hypertension', selectedQuestionnaire.hypertension ? 'Yes' : 'No'],
                                ['Diet History', selectedQuestionnaire.dietHistory],
                                ['Fruits Consumption', selectedQuestionnaire.fruitsConsumption],
                                ['Vegetable Consumption', selectedQuestionnaire.vegetableConsumption],
                                ['Habit History', selectedQuestionnaire.habitHistory],
                                ['Tobacco Chewer', selectedQuestionnaire.tobaccoChewer ? 'Yes' : 'No'],
                                ['Tobacco Type', selectedQuestionnaire.tobaccoType],
                                ['Discontinued Habit', selectedQuestionnaire.discontinuedHabit ? 'Yes' : 'No'],
                                ['Duration of Discontinuing Habit', selectedQuestionnaire.durationOfDiscontinuingHabit],
                                ['Other Consumption History', selectedQuestionnaire.otherConsumptionHistory],
                                ['Alcohol Consumption', selectedQuestionnaire.alcoholConsumption ? 'Yes' : 'No'],
                                ['Smoking', selectedQuestionnaire.smoking ? 'Yes' : 'No'],
                                ['Oral Cavity Examination', selectedQuestionnaire.oralCavityExamination],
                                ['Presence of Lesion', selectedQuestionnaire.presenceOfLesion ? 'Yes' : 'No'],
                                ['Reduction in Mouth Opening', selectedQuestionnaire.reductionInMouthOpening ? 'Yes' : 'No'],
                                ['Sudden Weight Loss', selectedQuestionnaire.suddenWeightLoss ? 'Yes' : 'No'],
                                ['Presence of Sharp Teeth', selectedQuestionnaire.presenceOfSharpTeeth ? 'Yes' : 'No'],
                                ['Presence of Decayed Teeth', selectedQuestionnaire.presenceOfDecayedTeeth ? 'Yes' : 'No'],
                                ['Presence of Fluorosis', selectedQuestionnaire.presenceOfFluorosis ? 'Yes' : 'No'],
                                ['Presence of Gum Disease', selectedQuestionnaire.presenceOfGumDisease?.join(', ')],
                            ].map(([label, value], idx) => (
                                <View key={`regular-${idx}`} style={styles.modelTextRow}>
                                    <GradientText
                                        text={`${label} :`}
                                        size={14}
                                        colors={['#5E346D', '#C13439']}
                                    />
                                    <Text style={styles.modalText}>{value || 'N/A'}</Text>
                                </View>
                            ))}


                            {selectedQuestionnaire.send_email_to_dantasurakshaks === true && (
                                <>
                                    <View style={styles.sectionDivider} />

                                    <View style={styles.modelText}>
                                        <GradientText
                                            text="Your Given Feedback"
                                            size={16}
                                            colors={['#5E346D', '#C13439']}
                                        />
                                    </View>

                                    {[
                                        ['Questionary Type', selectedQuestionnaire.questionary_type],
                                        ['Diagnosis Notes', selectedQuestionnaire.diagnosis_notes],
                                        ['Recommended Actions', selectedQuestionnaire.recomanded_actions],
                                        ['Comments/Notes', selectedQuestionnaire.comments_or_notes],
                                    ].map(([label, value], idx) => (
                                        <View key={`feedback-${idx}`} style={styles.modelTextNewRow}>
                                            <GradientText
                                                text={`${label} :`}
                                                size={14}
                                                colors={['#5E346D', '#C13439']}
                                            />
                                            <Text style={styles.modalText}>{value || 'N/A'}</Text>
                                        </View>
                                    ))}
                                </>
                            )}
                        </ScrollView>
                    )}
                    <Pressable style={styles.closeButton} onPress={closeModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );

    return (
        <Layout>
            <View style={{ alignItems: 'flex-start', marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: 10 }}>
                    <GradientText text="Questionnaires Received" size={18} />
                    <View style={{
                        backgroundColor: '#FFD6D6',
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 6,
                    }}>
                        <GradientText text={data?.totalResults} size={18} />
                    </View>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <LinearGradient
                    colors={['#FBEAFF', '#FFD6D6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.searchWrapper}>
                    <Ionicons name="search-outline" size={18} color="#660033" style={{ marginRight: 8 }} />
                    <TextInput placeholder="Search ……" placeholderTextColor="#660033" style={styles.searchInput} />
                </LinearGradient>
                <View style={styles.filterRow}>
                    <LinearGradient colors={['#56235E', '#C1392D']} style={styles.filterBtnAll}>
                        <Text style={styles.filterBtnAllText}>All</Text>
                    </LinearGradient>
                </View>
            </View>

            {isLoading ? <Loader /> : error ? (
                <Text style={styles.errorText}>Failed to load data</Text>
            ) : (
                <ScrollView style={{ marginTop: 8 }}>
                    {data?.data?.map((item, i) => (
                        <View key={item._id || i} style={styles.card}>
                            <View style={[
                                styles.statusBadge,
                                item.adminAction ? styles.successBadge : styles.pendingBadge
                            ]}>
                                <Text style={styles.statusText}>
                                    {item.adminAction ? (

                                        item.assignTo?._id === user?.id ? (
                                            `You ( ${user?.name} ) approved this questionnaire`
                                        ) : (
                                            `Questionnaire approved by ${item.assignTo?.name || ''}`
                                        )
                                    ) : (

                                        <>
                                            Feedback has been sent by{' '}
                                            <Text >
                                                {item.submitted_by?.name || 'N/A'}
                                            </Text>
                                            . Click to approve.
                                        </>
                                    )}
                                </Text>

                            </View>
                            <View style={[styles.caseRow, styles.caseNumberRow]}>
                                <Text style={styles.caseText}>Case Number :</Text>
                                <View style={styles.statusContainer}>

                                    <Text style={styles.caseNumber}>{item.case_number}</Text>

                                </View>
                            </View>
                            {[
                                ['Name', item.name],
                                ['Gender', item.gender],
                                ['CardNumber', item.cardNumber],

                            ].map(([label, value], idx) => (
                                <View key={idx} style={[styles.caseRow, styles.caseTextRow]}>
                                    <GradientText
                                        text={`${label} :`}
                                        size={14}
                                        colors={['#5E346D', '#C13439']}
                                    />
                                    <Text style={styles.cardText}>{value || 'N/A'}</Text>
                                </View>
                            ))}


                            <View style={[styles.caseRow, styles.caseActionRow]}>


                                <TouchableOpacity
                                    style={styles.filterBtnView}
                                    onPress={() => openModal(item)}
                                >
                                    <Text style={styles.filterBtnTextView}>view</Text>
                                </TouchableOpacity>

                                {!item.adminAction ? (
                                    <TouchableOpacity
                                        style={styles.takeoverButton}
                                        onPress={() => handleTakeover(item._id)}
                                    >
                                        <Text style={styles.takeoverButtonText}>click to approve</Text>
                                        <Ionicons name="checkmark-circle" size={18} color="#fff" style={styles.icon} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[
                                            styles.feedbackButton,
                                            (!item.adminAction || item.send_email_to_dantasurakshaks || item.assignTo?._id !== user?.id) && styles.disabledButton
                                        ]}
                                        onPress={() => navigation.navigate('QuestionnaireFeedback', { id: item._id })}
                                        disabled={!item.adminAction || item.send_email_to_dantasurakshaks || item.assignTo?._id !== user?.id}
                                    >
                                        <Text style={styles.feedbackButtonText}>
                                            {item.send_email_to_dantasurakshaks
                                                ? 'Feedback Sent'
                                                : (item.assignTo?._id === user?.id ? 'Send Feedback' : 'Already Taken')
                                            }
                                        </Text>
                                        <Ionicons
                                            name={item.send_email_to_dantasurakshaks ? 'checkmark' : 'mail'}
                                            size={18}
                                            color="#fff"
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                        </View>
                    ))}
                </ScrollView>
            )}
            {renderModal()}

        </Layout>
    );
}

const styles = StyleSheet.create({
    sectionDivider: {
        height: 1,

        marginVertical: 15,
    },
    sectionHeader: {
        marginBottom: 10,
    },
    filterBtnView: { backgroundColor: '#e5fff2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
    filterBtnTextView: { color: '#660033', fontWeight: 'bold' },
    searchContainer: {
        flex: 1
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#660033',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        color: '#660033'
    },
    filterRow: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 12
    },
    filterBtnAll: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 2,
    },
    filterBtnAllText: {
        color: 'white',
        fontWeight: 'bold'
    },
    filterBtn: {
        backgroundColor: '#e5fff2',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    filterBtnText: {
        color: '#660033',
        fontWeight: 'bold'
    },
    errorText: {
        color: 'red',
        textAlign: 'center'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginHorizontal: 2,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#eee',
    },
    caseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderColor: '#eee',
    },
    caseTextRow: {
        marginVertical: 4
    },
    caseNumberRow: {
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
    caseActionRow: {
        borderTopWidth: 1,
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    caseText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#660033'
    },
    caseNumber: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 4,
    },
    pendingBadge: {
        backgroundColor: '#FFA500',
    },
    successBadge: {
        backgroundColor: '#4CAF50',
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardText: {
        marginBottom: 5,
        color: '#000',
        textTransform: 'capitalize',
        paddingHorizontal: 10
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    actionText: {
        color: '#660033',
        fontWeight: 'bold'
    },
    takeoverButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#660033',
    },
    takeoverButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#660033',
    },
    feedbackButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    disabledButton: {
        backgroundColor: '#999',
    },
    icon: {
        marginLeft: 8
    },
    modalScroll: {
        marginTop: 10,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '85%',
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#660033',
    },
    modelTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
        paddingBottom: 6,
        gap: 10,
        flexWrap: 'wrap',
        borderBottomWidth: 1.5,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
    },
    modelTextNewRow: {
        textAlign: 'left',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: 6,
        paddingBottom: 6,
        gap: 10,
        flexWrap: 'nowrap',
        borderBottomWidth: 1.5,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',

    },
    modelText: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        paddingBottom: 6,
        gap: 10,
        flexWrap: 'wrap',
        borderBottomWidth: 1.5,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
        fontSize: 40

    },
    modalText: {
        marginBottom: 8,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#660033',
        paddingVertical: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },

});