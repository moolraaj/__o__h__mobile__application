


import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    Pressable,
    ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { Layout } from '../../common/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import Loader from '../../common/Loader';


import { useAuth } from '../../navigation/AuthContext';

import { useFetchDantaRecievedQuestionnairesQuery } from '../../store/services/questionnaire/questionnaireApi';


type AssignTo = {
    _id: string;
    name?: string;
};

type QuestionnaireTypes = {
    _id?: string;
    assignTo?: AssignTo;
    send_email_to_dantasurakshaks?: boolean;
    questionary_type?: string;
    diagnosis_notes?: string;
    recomanded_actions?: string;
    comments_or_notes?: string;
    case_number?: string;
    name?: string;
    gender?: string;
    cardNumber?: string;
    // add other fields as needed
};

export default function RecievedQuestionaryScreen() {
    const { user } = useAuth();
    const id = user?.id
    const { data, isLoading, error } = useFetchDantaRecievedQuestionnairesQuery(id);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireTypes | null>(null);
    const openModal = (item: QuestionnaireTypes) => {
        setSelectedQuestionnaire(item);
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
        setSelectedQuestionnaire(null);
    };
    const renderModal = () => (
        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Feedback Details</Text>
                    {selectedQuestionnaire && (
                        <ScrollView
                            style={styles.modalScroll}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {selectedQuestionnaire.send_email_to_dantasurakshaks === true && (
                                <>
                                    <View style={styles.sectionDivider} />
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
            {isLoading ?
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
                : error ? (
                    <Text style={styles.errorText}>Failed to load data</Text>
                ) : (
                    <ScrollView style={{ marginTop: 8 }}>
                        {data?.data?.map((item: QuestionnaireTypes, i: number) => (
                            <View key={item._id || i} style={styles.card}>
                                <View>
                                    <LinearGradient
                                        colors={['#56235E', '#C1392D']}
                                        style={styles.gradientTextWrapper}
                                    >
                                        <Text style={styles.statusText}>
                                            {item.send_email_to_dantasurakshaks === true ? (
                                                item.assignTo?._id === user?.id && (
                                                    `Received Questionnaire form ( ${user?.name} )`
                                                )
                                            ) : ''}
                                        </Text>
                                    </LinearGradient>
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
                                        <Text style={styles.filterBtnTextView}>view Feedback sent by {item?.assignTo?.name}</Text>
                                    </TouchableOpacity>
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientTextWrapper: {
        paddingHorizontal: 8,
        paddingVertical: 7,
        borderRadius: 4,
    },
    sectionDivider: {
        height: 1,
        marginVertical: 15,
    },
    sectionHeader: {
        marginBottom: 10,
    },
    filterBtnView: { backgroundColor: '#e5fff2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, justifyContent: 'center' },
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