

import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { Layout } from '../../common/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import { useFetchAdminAllQuestionnairesQuery, useTakeoverQuestionnaireMutation } from '../../store/services/questionnaire/questionnaireApi';
import { useAuth } from '../../navigation/AuthContext';
import { ToastMessage } from '../../resuable/Toast';
import { useRoute } from '@react-navigation/native';
import { GlobalText } from '../../constants/GlobalText';

const { width } = Dimensions.get('window');

export default function QuestionReceivedList({ navigation }: { navigation: any }) {
    const { data, isLoading, error, refetch } = useFetchAdminAllQuestionnairesQuery({ page: 1 });
    const [takeoverQuestionnaire] = useTakeoverQuestionnaireMutation();
    const [searchQuery, setSearchQuery] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireTypes | null>(null);

    const { user } = useAuth();
    const route = useRoute();

    const { highlightId } = route.params || {};
 

    

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

    const filteredData = data?.data?.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.case_number?.toString().includes(searchQuery)
    );

    const renderModal = () => (
        <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['#5E346D', '#C13439']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.modalHeader}
                    >
                        <GlobalText style={styles.modalTitle}>Questionnaire Details</GlobalText>
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
                                    <Ionicons name="person" size={32} color="#6a3093" />
                                </View>
                                <View style={styles.patientInfoText}>
                                    <GlobalText style={styles.patientName}>{selectedQuestionnaire.name}</GlobalText>
                                    <View style={styles.infoRow}>
                                        <GlobalText style={styles.infoLabel}>Case #:</GlobalText>
                                        <GlobalText style={styles.infoValue}>{selectedQuestionnaire.case_number}</GlobalText>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <GlobalText style={styles.infoLabel}>Age/Gender:</GlobalText>
                                        <GlobalText style={styles.infoValue}>{selectedQuestionnaire.age} / {selectedQuestionnaire.gender}</GlobalText>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <GlobalText style={styles.sectionTitle}>Personal Information</GlobalText>
                                <View style={styles.detailsGrid}>
                                    {[
                                        ['Card Number', selectedQuestionnaire.cardNumber],
                                        ['Phone', selectedQuestionnaire.phoneNumber],
                                        ['Address', selectedQuestionnaire.address],
                                        ['Blood Group', selectedQuestionnaire.bloodGroup],
                                        ['Religion', selectedQuestionnaire.religion],
                                        ['Education', selectedQuestionnaire.education],
                                        ['Occupation', selectedQuestionnaire.occupation],
                                        ['Income', selectedQuestionnaire.income],
                                    ].map(([label, value], idx) => (
                                        <View key={`personal-${idx}`} style={styles.detailItem}>
                                            <GlobalText style={styles.detailLabel}>{label}</GlobalText>
                                            <GlobalText style={styles.detailValue}>{value || 'N/A'}</GlobalText>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <GlobalText style={styles.sectionTitle}>Medical History</GlobalText>
                                <View style={styles.detailsGrid}>
                                    {[
                                        ['Family History', selectedQuestionnaire.familyHistory],
                                        ['Diabetes', selectedQuestionnaire.diabetes ? 'Yes' : 'No'],
                                        ['Hypertension', selectedQuestionnaire.hypertension ? 'Yes' : 'No'],
                                        ['Height', selectedQuestionnaire.height],
                                        ['Oral Lesion', selectedQuestionnaire.presenceOfLesion ? 'Yes' : 'No'],
                                        ['Mouth Opening', selectedQuestionnaire.reductionInMouthOpening ? 'Reduced' : 'Normal'],
                                        ['Weight Loss', selectedQuestionnaire.suddenWeightLoss ? 'Yes' : 'No'],
                                    ].map(([label, value], idx) => (
                                        <View key={`medical-${idx}`} style={styles.detailItem}>
                                            <GlobalText style={styles.detailLabel}>{label}</GlobalText>
                                            <GlobalText style={styles.detailValue}>{value || 'N/A'}</GlobalText>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <GlobalText style={styles.sectionTitle}>Habit History</GlobalText>
                                <View style={styles.detailsGrid}>
                                    {[
                                        ['Tobacco Use', selectedQuestionnaire.tobaccoChewer ? 'Yes' : 'No'],
                                        ['Tobacco Type', selectedQuestionnaire.tobaccoType],
                                        ['Alcohol', selectedQuestionnaire.alcoholConsumption ? 'Yes' : 'No'],
                                        ['Smoking', selectedQuestionnaire.smoking ? 'Yes' : 'No'],
                                        ['Discontinued', selectedQuestionnaire.discontinuedHabit ? 'Yes' : 'No'],
                                        ['Duration', selectedQuestionnaire.durationOfDiscontinuingHabit],
                                    ].map(([label, value], idx) => (
                                        <View key={`habit-${idx}`} style={styles.detailItem}>
                                            <GlobalText style={styles.detailLabel}>{label}</GlobalText>
                                            <GlobalText style={styles.detailValue}>{value || 'N/A'}</GlobalText>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {selectedQuestionnaire.send_email_to_dantasurakshaks === true && (
                                <View style={styles.sectionContainer}>
                                    <LinearGradient
                                        colors={['#5E346D', '#C13439']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.feedbackHeader}
                                    >
                                        <GlobalText style={styles.feedbackTitle}>Your Given Feedback :</GlobalText>
                                    </LinearGradient>
                                    <View style={styles.feedbackContent}>
                                        {[
                                            ['Questionary Type', selectedQuestionnaire.questionary_type],
                                            ['Diagnosis Notes', selectedQuestionnaire.diagnosis_notes],
                                            ['Recommended Actions', selectedQuestionnaire.recomanded_actions],
                                            ['Comments', selectedQuestionnaire.comments_or_notes],
                                        ].map(([label, value], idx) => (
                                            <View key={`feedback-${idx}`} style={styles.feedbackItem}>
                                                <GlobalText style={styles.feedbackLabel}>{label}</GlobalText>
                                                <GlobalText style={styles.feedbackValue}>{value || 'N/A'}</GlobalText>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <Layout>
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <GradientText text="Questionnaires Received" size={22} />
                    <View style={styles.counterBadge}>
                        <GlobalText style={styles.counterText}>
                            <GradientText text={data?.totalResults} size={15} />
                        </GlobalText>
                    </View>
                </View>
                <GlobalText style={styles.subHeader}>Review and manage patient questionnaires</GlobalText>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={20} color="#6a3093" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search by name or case number..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#ccc" />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.filterRow}>
                    <LinearGradient colors={['#56235E', '#C1392D']} style={styles.filterBtnAll}>
                        <GlobalText style={styles.filterBtnAllText}>All</GlobalText>
                    </LinearGradient>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={40} color="#ff6b6b" />
                    <GlobalText style={styles.errorText}>Failed to load questionnaires</GlobalText>
                    <TouchableOpacity onPress={refetch} style={styles.retryButton}>
                        <GlobalText style={styles.retryText}>Retry</GlobalText>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.listContainer}>
                    {filteredData?.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={60} color="#ddd" />
                            <GlobalText style={styles.emptyText}>No questionnaires found</GlobalText>
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <GlobalText style={styles.clearSearchText}>Clear search</GlobalText>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        filteredData?.map((item, i) => (
                            <View key={item._id || i} style={[styles.card,item._id === highlightId ? { backgroundColor: '#EAF4FF' } : null]}  >
                                
                                <View style={styles.cardHeader}>
                                    <GlobalText style={styles.caseNumber}>Case #{item.case_number}</GlobalText>
                                    <View style={[
                                        styles.statusBadge,
                                        item.adminAction ? styles.approvedBadge : styles.pendingBadge
                                    ]}>
                                        <GlobalText style={styles.statusText}>
                                            {item.adminAction ? 'Approved' : 'Pending'}
                                        </GlobalText>
                                    </View>
                                </View>

                                <View style={styles.patientInfo}>
                                    <View style={styles.caseRow}>
                                        <GradientText
                                            text="Name :"
                                            size={14}
                                            colors={['#5E346D', '#C13439']}
                                        />
                                        <GlobalText style={styles.patientName}>{item.name}</GlobalText>
                                    </View>
                                    <View style={styles.caseRow}>
                                        <GradientText
                                            text="Gender :"
                                            size={14}
                                            colors={['#5E346D', '#C13439']}
                                        />
                                        <GlobalText style={styles.patientGender}>{item.gender}</GlobalText>
                                    </View>
                                    <View style={styles.caseRow}>
                                        <GradientText
                                            text="Age :"
                                            size={14}
                                            colors={['#5E346D', '#C13439']}
                                        />
                                        <GlobalText style={styles.patientAge}>{item.age}</GlobalText>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={() => openModal(item)}
                                    >
                                        <Ionicons name="eye" size={16} color="#6a3093" />
                                        <GlobalText style={styles.viewButtonText}>View Details</GlobalText>
                                    </TouchableOpacity>

                                    {!item.adminAction ? (
                                        <TouchableOpacity
                                            style={styles.approveButton}
                                            onPress={() => handleTakeover(item._id)}
                                        >
                                            <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                            <GlobalText style={styles.approveButtonText}>Approve</GlobalText>
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
                                            <Ionicons
                                                name={item.send_email_to_dantasurakshaks ? 'checkmark' : 'mail'}
                                                size={16}
                                                color="#fff"
                                            />
                                            <GlobalText style={styles.feedbackButtonText}>
                                                {item.send_email_to_dantasurakshaks
                                                    ? 'Feedback Sent'
                                                    : (item.assignTo?._id === user?.id ? 'Send Feedback' : 'Taken')
                                                }
                                            </GlobalText>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {
                                    item.adminAction && (
                                        <View style={styles.approvedByContainer}>
                                            <Ionicons name="person-circle" size={14} color="#6a3093" />
                                            <GlobalText style={styles.approvedByText}>
                                                {item.assignTo?._id === user?.id
                                                    ? 'Approved by you'
                                                    : `Approved by ${item.assignTo?.name || 'admin'}`}
                                            </GlobalText>
                                        </View>
                                    )
                                }
                            </View>
                        ))
                    )}
                </ScrollView>
            )
            }

            {renderModal()}
        </Layout >
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    headerText: {
        fontWeight: '600',
    },
    subHeader: {
        color: '#666',
        fontSize: 14,
    },
    counterBadge: {
        backgroundColor: '#FFD6D6',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    counterText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginBottom: 10,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#333',
        fontSize: 15,
    },
    clearSearch: {
        marginLeft: 10,
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
    listContainer: {
        flex: 1,
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    caseNumber: {
        color: '#6a3093',
        fontWeight: '600',
        fontSize: 16,
    },
    statusBadge: {
        borderRadius: 15,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    pendingBadge: {
        backgroundColor: '#FFA500',
    },
    approvedBadge: {
        backgroundColor: '#4CAF50',
    },
    caseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#eee',
        gap: 15,
        marginBottom: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    patientInfo: {
        paddingHorizontal: 10,
        paddingTop: 6,
        paddingBottom: 15,
    },
    nameGenderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
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
    patientAge: {
        fontSize: 14,
        color: '#666',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 12
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
    },
    approveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#6a3093',
    },
    approveButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#660033',
    },
    feedbackButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },
    disabledButton: {
        backgroundColor: '#aaa',
    },
    approvedByContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    clearSearchText: {
        color: '#6a3093',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    // Modal styles
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
    modalScroll: {
        maxHeight: '90%',
    },
    scrollContent: {
        padding: 16,
    },
    patientInfoContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
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
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6a3093',
        marginBottom: 12,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    detailItem: {
        width: '48%',
        marginBottom: 12,
    },
    detailLabel: {
        color: '#666',
        fontSize: 13,
        marginBottom: 2,
    },
    detailValue: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
    feedbackHeader: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    feedbackTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    feedbackContent: {
        backgroundColor: '#f9f5ff',
        borderRadius: 8,
        padding: 12,
    },
    feedbackItem: {
        marginBottom: 10,
    },
    feedbackLabel: {
        color: '#6a3093',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    feedbackValue: {
        color: '#333',
        fontSize: 14,
        lineHeight: 20,
    },
});