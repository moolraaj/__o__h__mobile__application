import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import React, { useState } from 'react';
import { Layout } from '../../common/Layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import { useFetchAdminAllLesionsQuery } from '../../store/services/lesion/createLesionApi';
import { GlobalText } from '../../constants/GlobalText';

const { width } = Dimensions.get('window');

export default function LesionsReceivedList() {
    const { data, isLoading, error, refetch } = useFetchAdminAllLesionsQuery({ page: 1 });
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLesion, setSelectedLesion] = useState<Lesion | null>(null);

    const openModal = (item: Lesion) => {
        setSelectedLesion(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedLesion(null);
    };

    const filteredLesions = data?.lesions?.filter(lesion =>
        lesion.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesion.case_number?.toString().includes(searchQuery)
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
                        <GlobalText style={styles.modalTitle}>Lesion Details</GlobalText>
                        <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </LinearGradient>

                    {selectedLesion && (
                        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.patientInfoContainer}>
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="medical" size={32} color="#6a3093" />
                                </View>
                                <View style={styles.patientInfoText}>
                                    <GlobalText style={styles.patientName}>{selectedLesion.fullname}</GlobalText>
                                    <View style={styles.infoRow}>
                                        <GlobalText style={styles.infoLabel}>Case #:</GlobalText>
                                        <GlobalText style={styles.infoValue}>{selectedLesion.case_number}</GlobalText>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <GlobalText style={styles.infoLabel}>Age/Gender:</GlobalText>
                                        <GlobalText style={styles.infoValue}>{selectedLesion.age} / {selectedLesion.gender}</GlobalText>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <GlobalText style={styles.sectionTitle}>Patient Information</GlobalText>
                                <View style={styles.detailsGrid}>
                                    {[
                                        ['Contact', selectedLesion.contact_number],
                                        ['Location', selectedLesion.location],
                                        ['Status', selectedLesion.status],
                                        ['Submission Date', selectedLesion.createdAt ? new Date(selectedLesion.createdAt).toLocaleDateString() : 'N/A'],
                                    ].map(([label, value], idx) => (
                                        <View key={`info-${idx}`} style={styles.detailItem}>
                                            <GlobalText style={styles.detailLabel}>{label}</GlobalText>
                                            <GlobalText style={styles.detailValue}>{value || 'N/A'}</GlobalText>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <GlobalText style={styles.sectionTitle}>Medical Details</GlobalText>
                                <View style={styles.detailsGrid}>
                                    {[
                                        ['Symptoms', Array.isArray(selectedLesion.symptoms) ? selectedLesion.symptoms.join(', ') : selectedLesion.symptoms],
                                        ['Disease Duration', selectedLesion.disease_time],
                                        ['Existing Habits', selectedLesion.existing_habits],
                                        ['Previous Treatment', Array.isArray(selectedLesion.previous_dental_treatement) ? selectedLesion.previous_dental_treatement.join(', ') : selectedLesion.previous_dental_treatement],
                                    ].map(([label, value], idx) => (
                                        <View key={`medical-${idx}`} style={styles.detailItem}>
                                            <GlobalText style={styles.detailLabel}>{label}</GlobalText>
                                            <GlobalText style={styles.detailValue}>{value || 'N/A'}</GlobalText>
                                        </View>
                                    ))}
                                </View>
                            </View>
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
                    <GradientText text="Lesions Received" size={22} />
                    <View style={styles.counterBadge}>
                        <GlobalText style={styles.counterText}>
                            <GradientText text={data?.totalResults} size={15} />
                        </GlobalText>
                    </View>
                </View>
                <GlobalText style={styles.subHeader}>Review and manage reported lesions</GlobalText>
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
                    <ActivityIndicator size="large" color="#6a3093" />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={40} color="#ff6b6b" />
                    <GlobalText style={styles.errorText}>Failed to load lesions</GlobalText>
                    <TouchableOpacity onPress={refetch} style={styles.retryButton}>
                        <GlobalText style={styles.retryText}>Retry</GlobalText>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.listContainer}>
                    {filteredLesions?.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={60} color="#ddd" />
                            <GlobalText style={styles.emptyText}>No lesions found</GlobalText>
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <GlobalText style={styles.clearSearchText}>Clear search</GlobalText>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        filteredLesions?.map((item, i) => (
                            <View key={item._id || i} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <GlobalText style={styles.caseNumber}>Case #{item.case_number}</GlobalText>
                                    <View style={[
                                        styles.statusBadge,
                                        item.status === 'pending' ? styles.pendingBadge :
                                            item.status === 'reviewed' ? styles.reviewedBadge :
                                                styles.completedBadge
                                    ]}>
                                        <GlobalText style={styles.statusText}>
                                            {(item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A')}
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
                                        <GlobalText style={styles.patientName}>{item.fullname}</GlobalText>
                                    </View>
                                    <View style={styles.caseRow}>
                                        <GradientText
                                            text="Submitted :"
                                            size={14}
                                            colors={['#5E346D', '#C13439']}
                                        />
                                        <GlobalText>
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                                        </GlobalText>
                                    </View>
                                </View>
                                <TouchableOpacity style={[styles.caseRow, styles.caseActionRow]} onPress={() => openModal(item)}>
                                    <GlobalText style={styles.actionText}>Action</GlobalText>
                                    <Ionicons name="eye" size={18} color="#660033" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
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
        fontSize: 16,
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
    reviewedBadge: {
        backgroundColor: '#4CAF50',
    },
    completedBadge: {
        backgroundColor: '#6a3093',
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
        paddingBottom: 10,
    },
    patientName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    infoRowCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabelCard: {
        color: '#666',
        fontSize: 13,
        marginRight: 8,
    },
    infoValueCard: {
        color: '#333',
        fontSize: 13,
    },
    caseActionRow: {
        borderTopWidth: 1,
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    actionText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#660033'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
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
});