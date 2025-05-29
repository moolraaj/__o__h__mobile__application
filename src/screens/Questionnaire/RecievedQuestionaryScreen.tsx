


import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    Pressable,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import React, { useState } from 'react';
import { Layout } from '../../common/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import { useAuth } from '../../navigation/AuthContext';
import { useFetchDantaRecievedQuestionnairesQuery } from '../../store/services/questionnaire/questionnaireApi';
import { AppError } from '../../common/AppError';

const { width } = Dimensions.get('window');

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
    const { data, isLoading, error, refetch } = useFetchDantaRecievedQuestionnairesQuery(id);
    console.log('werwerwer', data)
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
                    <LinearGradient
                        colors={['#5E346D', '#C13439']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.modalHeader}
                    >
                        <Text style={styles.modalTitle}>Feedback Details</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </LinearGradient>

                    {selectedQuestionnaire && (
                        <ScrollView
                            style={styles.modalScroll}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.patientInfoContainer}>
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="person" size={25} color="#6a3093" />
                                </View>
                                <View style={styles.patientInfoText}>
                                    <Text style={styles.patientName}>{selectedQuestionnaire.name}</Text>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Case #:</Text>
                                        <Text style={styles.infoValue}>{selectedQuestionnaire.case_number}</Text>
                                    </View>
                                </View>
                            </View>

                            {selectedQuestionnaire.send_email_to_dantasurakshaks === true && (
                                <>
                                    <View style={styles.sectionDivider} />
                                    {[
                                        ['Questionary Type', selectedQuestionnaire.questionary_type],
                                        ['Diagnosis Notes', selectedQuestionnaire.diagnosis_notes],
                                        ['Recommended Actions', selectedQuestionnaire.recomanded_actions],
                                        ['Comments/Notes', selectedQuestionnaire.comments_or_notes],
                                    ].map(([label, value], idx) => (
                                        <View key={`feedback-${idx}`} style={styles.modelTextRow}>
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
                </View>
            </View>
        </Modal>
    );
    return (
        <Layout>
            <View style={{ alignItems: 'flex-start', marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: 10 }}>
                    <GradientText text="Feedback Received" size={18} />
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
                : error || !data ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={40} color="#ff6b6b" />
                        <Text style={styles.errorText}>Failed to load lesions</Text>
                        <TouchableOpacity onPress={refetch} style={styles.retryButton}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView style={{ marginTop: 8 }}>
                        {data?.data?.map((item: QuestionnaireTypes, i: number) => (
                            <View key={item._id || i} style={styles.card}>
                                <View>
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
                                    <View key={idx} style={styles.caseRow}>
                                        <GradientText
                                            text={`${label} :`}
                                            size={14}
                                            colors={['#5E346D', '#C13439']}
                                        />
                                        <Text style={styles.cardText}>{value || 'N/A'}</Text>
                                    </View>
                                ))}


                                <View style={[styles.caseRow, styles.caseActionRow]}>
                                    {item.send_email_to_dantasurakshaks === true ?
                                        <View style={styles.approvedByContainer}>
                                            <Ionicons name="person-circle" size={14} color="#6a3093" />
                                            <Text style={styles.approvedByText}>
                                                {item.assignTo?._id === user?.id && (
                                                    `feedback sent by ${user?.name}`
                                                )}
                                            </Text>
                                        </View>
                                        : ''
                                    }
                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={() => openModal(item)}
                                    >
                                        <Ionicons name="eye" size={16} color="#6a3093" />
                                        <Text style={styles.viewButtonText}>View Details</Text>
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
        width: '100%'
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
    approvedByContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    approvedByText: {
        color: '#666',
        fontSize: 12,
        marginLeft: 6,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#6a3093',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
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
        paddingVertical: 2,
        borderColor: '#eee',
    },
    caseNumberRow: {
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
    caseActionRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f0e6ff',
    },
    viewButtonText: {
        color: '#6a3093',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 12,
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
        maxHeight: '80%',
    },
    scrollContent: {
        padding: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width - 40,
        maxHeight: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalHeader: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    closeIcon: {
        padding: 4,
    },
    patientInfoContainer: {
        flexDirection: 'row',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#f0e6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    patientInfoText: {
        flex: 1,
        justifyContent: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    infoLabel: {
        color: '#666',
        fontWeight: '600',
        marginRight: 8,
        fontSize: 13,
    },
    infoValue: {
        color: '#333',
        fontSize: 13,
    },
    patientName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginRight: 10,
    },
    patientGender: {
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
    },
    modelTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
        paddingBottom: 6,
        gap: 10,
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
    },
    modalText: {
        marginBottom: 8,
        color: '#333',
    },
});