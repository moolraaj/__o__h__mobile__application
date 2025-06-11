import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import { Layout } from '../../common/Layout';
import {
    useGetQuestionnairesQuery,
    useDeleteQuestionnaireMutation,
    useSubmitQuestionnaireMutation
} from '../../store/services/questionnaire/questionnaireApi';
import { ToastMessage } from '../../resuable/Toast';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function QuestionnaireLists({ navigation }: { navigation: any }) {
    const { data, isLoading, error, refetch } = useGetQuestionnairesQuery({ page: 1 });
    const [deleteQuestionnaire] = useDeleteQuestionnaireMutation();
    const [submitQuestionnaire] = useSubmitQuestionnaireMutation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [sendingId, setSendingId] = useState<string | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const openModal = (item: any) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Delete Questionnaire',
            'Are you sure you want to delete this questionnaire?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteQuestionnaire(id).unwrap();
                            refetch();
                            ToastMessage('success', 'Questionnaire delete!')
                        } catch {
                            Alert.alert('Error', 'Failed to delete questionnaire');
                        }
                    }
                }
            ]
        );
    };

    const handleSubmit = async (id: string) => {
        Alert.alert(
            'Submit Questionnaire',
            'Are you sure you want to submit this questionnaire to all admins?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Submit',
                    onPress: async () => {
                        try {
                            setSendingId(id);
                            const response = await submitQuestionnaire(id).unwrap();
                            Alert.alert('Success', response.message || 'Submitted successfully');
                            refetch();
                        } catch (err: any) {
                            Alert.alert('Error', err.data?.message || err.error || 'Failed to submit');
                        } finally {
                            setSendingId(null);
                        }
                    }
                }
            ]
        );
    };
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
                        <Text style={styles.modalTitle}>Questionnaire Details</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </LinearGradient>

                    {selectedItem && (
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
                                    <Text style={styles.patientName}>{selectedItem.name}</Text>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Case #:</Text>
                                        <Text style={styles.infoValue}>{selectedItem.case_number}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Age/Gender:</Text>
                                        <Text style={styles.infoValue}>{selectedItem.age} / {selectedItem.gender}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Personal Information</Text>
                                <View style={styles.detailsGrid}>
                                    {[
                                        ['Card Number', selectedItem.cardNumber],
                                        ['Phone', selectedItem.phoneNumber],
                                        ['Address', selectedItem.address],
                                        ['Blood Group', selectedItem.bloodGroup],
                                        ['Religion', selectedItem.religion],
                                        ['Education', selectedItem.education],
                                        ['Occupation', selectedItem.occupation],
                                        ['Income', selectedItem.income],
                                    ].map(([label, value], idx) => (
                                        <View key={`personal-${idx}`} style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>{label}</Text>
                                            <Text style={styles.detailValue}>{value || 'N/A'}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Medical History</Text>
                                <View style={styles.detailsGrid}>
                                    {[
                                        ['Family History', selectedItem.familyHistory],
                                        ['Diabetes', selectedItem.diabetes ? 'Yes' : 'No'],
                                        ['Hypertension', selectedItem.hypertension ? 'Yes' : 'No'],
                                        ['Height', selectedItem.height],
                                        ['Oral Lesion', selectedItem.presenceOfLesion ? 'Yes' : 'No'],
                                        ['Mouth Opening', selectedItem.reductionInMouthOpening ? 'Reduced' : 'Normal'],
                                        ['Weight Loss', selectedItem.suddenWeightLoss ? 'Yes' : 'No'],
                                    ].map(([label, value], idx) => (
                                        <View key={`medical-${idx}`} style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>{label}</Text>
                                            <Text style={styles.detailValue}>{value || 'N/A'}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Habit History</Text>
                                <View style={styles.detailsGrid}>
                                    {[
                                        ['Tobacco Use', selectedItem.tobaccoChewer ? 'Yes' : 'No'],
                                        ['Tobacco Type', selectedItem.tobaccoType],
                                        ['Alcohol', selectedItem.alcoholConsumption ? 'Yes' : 'No'],
                                        ['Smoking', selectedItem.smoking ? 'Yes' : 'No'],
                                        ['Discontinued', selectedItem.discontinuedHabit ? 'Yes' : 'No'],
                                        ['Duration', selectedItem.durationOfDiscontinuingHabit],
                                    ].map(([label, value], idx) => (
                                        <View key={`habit-${idx}`} style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>{label}</Text>
                                            <Text style={styles.detailValue}>{value || 'N/A'}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {selectedItem.send_email_to_dantasurakshaks === true && (
                                <View style={styles.sectionContainer}>
                                    <LinearGradient
                                        colors={['#5E346D', '#C13439']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.feedbackHeader}
                                    >
                                        <Text style={styles.feedbackTitle}>Feedback details:</Text>
                                    </LinearGradient>
                                    <View style={styles.feedbackContent}>
                                        {[
                                            ['Questionary Type', selectedItem.questionary_type],
                                            ['Diagnosis Notes', selectedItem.diagnosis_notes],
                                            ['Recommended Actions', selectedItem.recomanded_actions],
                                            ['Comments', selectedItem.comments_or_notes],
                                        ].map(([label, value], idx) => (
                                            <View key={`feedback-${idx}`} style={styles.feedbackItem}>
                                                <Text style={styles.feedbackLabel}>{label}</Text>
                                                <Text style={styles.feedbackValue}>{value || 'N/A'}</Text>
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
            <View style={{ alignItems: 'flex-start', marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: 10 }}>
                    <GradientText text="Questionnaires" size={18} />
                    <View style={{
                        backgroundColor: '#FFD6D6',
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 6,
                    }}>
                        <GradientText text={data?.totalResults || 0} size={18} />
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

                    <LinearGradient
                        colors={['#56235E', '#C1392D']}
                        style={styles.addBtnGradient}
                    >
                        <TouchableOpacity
                            style={styles.addBtnInner}
                            onPress={() => navigation.navigate('CreateQuestionnaire')}
                        >
                            <Ionicons name="add" size={22} color="#fff" />
                        </TouchableOpacity>
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
                    <ScrollView style={{ marginTop: 8, }}>
                        {data?.data?.map((item: QuestionnaireTypes, i: number) => (
                            <View key={item._id || i} style={styles.card}>
                                <View style={[styles.caseRow, styles.caseNumberRow]}>
                                    <Text style={styles.caseText}>Case Number :</Text>
                                    <Text style={styles.caseNumber}>{item?.case_number}</Text>
                                </View>
                                {[
                                    ['Patient Name', item.name],
                                    ['Gender', item.gender],
                                    ['Status', item.status]
                                ].map(([label, value], idx) => (
                                    <View key={idx} style={[styles.caseRow, styles.caseTextRow]}>
                                        <GradientText
                                            text={`${label} :`}
                                            size={14}
                                            colors={['#5E346D', '#C13439']}
                                        />
                                        <Text style={styles.cardText}>{typeof value === 'string' || typeof value === 'number' ? value : 'N/A'}</Text>
                                    </View>
                                ))}

                                <View style={styles.cardActions}>
                                    {/* View Button */}
                                    <TouchableOpacity
                                        style={styles.filterBtn}
                                        onPress={() => openModal(item)}
                                    >
                                        <Feather name="eye" size={16} color="#56235E" />
                                    </TouchableOpacity>

                                    {/* Edit Button */}
                                    <TouchableOpacity
                                        style={[styles.filterBtn, item.status === 'submit' && styles.disabledButton]}
                                        onPress={() => navigation.navigate('UpdateQuestionnaire', { id: item._id })}
                                        disabled={item.status === 'submit' || sendingId === item._id}
                                    >
                                        <Feather
                                            name="edit"
                                            size={16}
                                            color={item.status === 'submit' ? '#999' : '#56235E'}
                                        />
                                        <Text style={[styles.filterBtnText, item.status === 'submit' && styles.disabledButtonColor]}>
                                            Edit
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Send Button */}
                                    <TouchableOpacity
                                        style={[styles.filterBtn, item.status === 'submit' && styles.disabledButton]}
                                        onPress={() => handleSubmit(item._id)}
                                        disabled={item.status === 'submit'}
                                    >
                                        {sendingId === item._id ? (
                                            <ActivityIndicator size="small" color="#56235E" />
                                        ) : (
                                            <Feather
                                                name={item.status === 'submit' ? 'check-circle' : 'send'}
                                                size={16}
                                                color={item.status === 'submit' ? '#4CAF50' : '#56235E'}
                                            />
                                        )}
                                        <Text style={[styles.filterBtnText, item.status === 'submit' && styles.disabledButtonColor]}>
                                            {item.status === 'submit' ? ' Sent' : sendingId === item._id ? 'Sending…' : ' Send'}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Delete Button */}
                                    <TouchableOpacity
                                        style={styles.filterBtn}
                                        onPress={() => handleDelete(item._id)}
                                    >
                                        <Feather name="trash-2" size={16} color="#DE2027" />
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        gap: 10,
    },
    countBadge: {
        backgroundColor: '#FFD6D6',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },

    searchContainer: { width: '100%' },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#660033',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    searchInput: { flex: 1, color: '#660033' },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
    filterBtnAll: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8 },
    filterBtnAllText: { color: 'white', fontWeight: 'bold' },
    addBtnGradient: { borderRadius: 22, padding: 1 },
    addBtnInner: { width: 30, height: 30, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

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
    caseRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, borderColor: '#eee' },
    caseNumberRow: { justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 8 },
    caseTextRow: { marginVertical: 4 },
    caseText: { fontWeight: 'bold', fontSize: 16, color: '#660033' },
    caseNumber: { fontSize: 14, fontWeight: 'bold', color: '#000' },
    cardText: { marginBottom: 5, color: '#000', textTransform: 'capitalize', paddingHorizontal: 10 },

    cardActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 10, paddingBottom: 10, gap: 8 },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 6,
        backgroundColor: '#F3E5F5',
        marginHorizontal: 4,
        gap: 2
    },
    filterBtnText: {
        color: '#56235E',
        fontSize: 12,
        fontWeight: '500',
    },
    disabledButton: {
        backgroundColor: '#EEEEEE',
    },
    disabledButtonColor: {
        color: '#999999',
    },

    errorText: { color: 'red', textAlign: 'center' },

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
    patientName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginRight: 10,
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