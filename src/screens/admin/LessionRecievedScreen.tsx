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
import { useFetchAdminAllLesionsQuery } from '../../store/services/lesion/createLesionApi';
 

export default function LesionsReceivedList() {
    
    const { data, isLoading, error } = useFetchAdminAllLesionsQuery({ page: 1 });
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLesion, setSelectedLesion] = useState<Lesion | null>(null);

    console.log(`data`)
    console.log(data)

    const openModal = (item: Lesion) => {
        setSelectedLesion(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedLesion(null);
    };

    const renderModal = () => (
        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Lesion Details</Text>
                    {selectedLesion && (
                        <>
                            {[
                                ['Name', selectedLesion.fullname],
                                ['Age', selectedLesion.age],
                                ['Gender', selectedLesion.gender],
                                ['Contact', selectedLesion.contact_number],
                                ['Location', selectedLesion.location],
                                ['Symptoms', Array.isArray(selectedLesion.symptoms) ? selectedLesion.symptoms.join(', ') : selectedLesion.symptoms],
                                ['Disease Time', selectedLesion.disease_time],
                                ['Habits', selectedLesion.existing_habits],
                                ['Previous Dental Treatment', Array.isArray(selectedLesion.previous_dental_treatement) ? selectedLesion.previous_dental_treatement.join(', ') : selectedLesion.previous_dental_treatement]
                            ].map(([label, value], idx) => (
                                <View key={idx} style={styles.modelTextRow}>
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
                    <GradientText text="Lesions Received" size={18} />
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
                    {data?.lesions?.map((item, i) => (
                        <View key={item._id || i} style={styles.card}>
                            <View style={[styles.caseRow, styles.caseNumberRow]}>
                                <Text style={styles.caseText}>Case Number :</Text>
                                <Text style={styles.caseNumber}>{item.case_number}</Text>
                            </View>
                            {[
                                ['Patient Name', item.fullname],
                                ['Submission Date', new Date(item.createdAt).toLocaleDateString()],
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
                            <TouchableOpacity style={[styles.caseRow, styles.caseActionRow]} onPress={() => openModal(item)}>
                                <Text style={styles.actionText}>Action</Text>
                                <Ionicons name="eye" size={18} color="#660033" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}
            {renderModal()}
        </Layout>
    );
}
const styles = StyleSheet.create({
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
    cardText: {
        marginBottom: 5,
        color: '#000',
        textTransform: 'capitalize',
        paddingHorizontal: 10
    },
    actionText: {
        color: '#660033',
        fontWeight: 'bold'
    },
    icon: {
        marginLeft: 8
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
    }
});
