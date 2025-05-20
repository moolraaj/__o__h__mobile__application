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
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import Loader from '../../common/Loader';
import { Layout } from '../../common/Layout';
import {
    useGetQuestionnairesQuery,
    useDeleteQuestionnaireMutation,
    useSubmitQuestionnaireMutation
} from '../../store/services/questionnaire/questionnaireApi';
import { ToastMessage } from '../../resuable/Toast';

export default function QuestionnaireLists({ navigation }: { navigation: any }) {
    const { data, isLoading, error, refetch } = useGetQuestionnairesQuery({ page: 1 });
    const [deleteQuestionnaire] = useDeleteQuestionnaireMutation();
    const [submitQuestionnaire, { isLoading: isSubmitting }] = useSubmitQuestionnaireMutation();
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
                            ToastMessage('success','Questionnaire delete!')
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
        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Questionnaire Details</Text>
                    {selectedItem && (
                        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            {[
                                ['Name', selectedItem.name],
                                ['Age', selectedItem.age?.toString()],
                                ['Gender', selectedItem.gender],
                                ['Card Number', selectedItem.cardNumber?.toString()],
                                ['Phone', selectedItem.phoneNumber],
                                ['Address', selectedItem.address],
                                ['Blood Group', selectedItem.bloodGroup],
                                ['ID Card', selectedItem.idCardAvailable ? 'Yes' : 'No'],
                                ['Religion', selectedItem.religion],
                                ['Education', selectedItem.education],
                                ['Occupation', selectedItem.occupation],
                                ['Income', selectedItem.income?.toString()],
                                ['Family History', selectedItem.familyHistory],
                                ['Diabetes', selectedItem.diabetes ? 'Yes' : 'No'],
                                ['Hypertension', selectedItem.hypertension ? 'Yes' : 'No'],
                                ['Diet History', selectedItem.dietHistory],
                                ['Fruits', selectedItem.fruitsConsumption],
                                ['Vegetables', selectedItem.vegetableConsumption],
                                ['Habits', selectedItem.habitHistory],
                                ['Tobacco Chewer', selectedItem.tobaccoChewer ? 'Yes' : 'No'],
                                ['Tobacco Type', selectedItem.tobaccoType],
                                ['Discontinued Habit', selectedItem.discontinuedHabit ? 'Yes' : 'No'],
                                ['Duration', selectedItem.durationOfDiscontinuingHabit],
                                ['Alcohol Consumption', selectedItem.alcoholConsumption ? 'Yes' : 'No'],
                                ['Smoking', selectedItem.smoking ? 'Yes' : 'No'],
                                ['Oral Exam', selectedItem.oralCavityExamination],
                                ['Lesion Present', selectedItem.presenceOfLesion ? 'Yes' : 'No'],
                                ['Sharp Teeth', selectedItem.presenceOfSharpTeeth ? 'Yes' : 'No'],
                                ['Decayed Teeth', selectedItem.presenceOfDecayedTeeth ? 'Yes' : 'No'],
                                ['Fluorosis', selectedItem.presenceOfFluorosis ? 'Yes' : 'No'],
                                ['Gum Disease', selectedItem.presenceOfGumDisease?.join(', ')],
                                ['Mouth Opening', selectedItem.reductionInMouthOpening ? 'Yes' : 'No'],
                                ['Weight Loss', selectedItem.suddenWeightLoss ? 'Yes' : 'No'],
                                ['Symptoms', selectedItem.symptoms?.join(', ')],
                                ['Prev Treatment', selectedItem.previous_dental_treatement?.join(', ')],
                                ['Status', selectedItem.status]
                            ].map(([label, value], idx) => (
                                <View key={idx} style={styles.modelTextRow}>
                                    <GradientText text={`${label} :`} size={14} colors={['#5E346D', '#C13439']} />
                                    <Text style={styles.modalText}>{value || 'N/A'}</Text>
                                </View>
                            ))}
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

            {isLoading ? <Loader /> : error ? (
                <Text style={styles.errorText}>Failed to load data</Text>
            ) : (
                <ScrollView style={{ marginTop: 8 }}>
                    {data?.data?.map((item, i) => (
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
                                    <Text style={styles.cardText}>{value || 'N/A'}</Text>
                                </View>
                            ))}

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={[styles.filterBtn]}
                                    onPress={() => openModal(item)}
                                >
                                    <Text style={styles.filterBtnText}>View</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.filterBtn,
                                        (item.status === 'submit') && styles.disabledButton
                                    ]}
                                    onPress={() => navigation.navigate('UpdateQuestionnaire', { id: item._id })}
                                    disabled={item.status === 'submit' || sendingId === item._id}
                                >

                                    <Text style={[styles.filterBtnText, (item.status === 'submit') && styles.disabledButtonColor]}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.filterBtn,
                                        (item.status === 'submit') && styles.disabledButton
                                    ]}
                                    onPress={() => handleSubmit(item._id)}
                                    disabled={item.status === 'submit'}
                                >

                                    <Text style={[styles.filterBtnText, (item.status === 'submit') && styles.disabledButtonColor]}>
                                        {item.status === 'submit'
                                            ? 'Submit'
                                            : sendingId === item._id
                                                ? 'Sending...'
                                                : 'Send'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.filterBtn]}
                                    onPress={() => handleDelete(item._id)}
                                >

                                    <Text style={styles.filterBtnText}>Delete</Text>
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

    searchContainer: { flex: 1 },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#660033',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    searchInput: { flex: 1, color: '#660033' },
    filterRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
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
    filterBtn: { backgroundColor: '#e5fff2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
    filterBtnText: { color: '#660033', fontWeight: 'bold' },
    disabledButton: { backgroundColor: '#999' },
    disabledButtonColor: { color: '#fff' },

    errorText: { color: 'red', textAlign: 'center' },

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
    modalScroll: { marginTop: 10 },
    scrollContent: { paddingBottom: 20 },
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
    modalText: { marginBottom: 8, color: '#333' },
    closeButton: { marginTop: 20, backgroundColor: '#660033', paddingVertical: 10, borderRadius: 8 },
    closeButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});