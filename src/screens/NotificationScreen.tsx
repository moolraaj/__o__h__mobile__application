import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Layout } from '../common/Layout';
import { useAuth } from '../navigation/AuthContext';
import { useGetAllNotificationsQuery } from '../store/services/notifications/notificationsApi';
import notifee from '@notifee/react-native';
export default function NotificationScreen() {
    const { user } = useAuth()
    const {
        data: notifications = [],
        isLoading,
        refetch,
    } = useGetAllNotificationsQuery({
        user_id: user?.id,
        page: 1,
        limit: 50,
    });
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            refetch();
        });
        return unsubscribe;
    }, []);
    const result = notifications?.data ?? []
    useEffect(() => {
        if (!isLoading && notifications?.data?.length === 0) {
            notifee.cancelDisplayedNotifications();
            console.log('🧹 Cleared system notifications because no backend notifications found.');
        }
    }, [notifications, isLoading]);

    const handleClick = () => {
        

    }


    return (
        <Layout>
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.header}>
                        <View style={styles.textSection}>
                            <Text style={styles.heading}>Notifications</Text>
                            <Text style={styles.description}>
                                You have {result.filter(n => n.read === false).length} unread notifications
                            </Text>
                        </View>
                    </View>

                    {result.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
                            No notifications yet.
                        </Text>
                    ) : (
                        result.map((notification) => (
                            <View
                                key={notification._id}
                                style={[
                                    styles.mythBox,
                                    notification.read ? { backgroundColor: '#F3F4F6' } : { backgroundColor: '#E0E7FF' },
                                ]}
                            >
                                <View style={styles.factRow}>
                                    <MaterialIcons
                                        name={notification.icon || 'notifications'}
                                        size={24}
                                        color="#800080"
                                        style={styles.icon}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={[
                                                styles.factText,
                                                { fontWeight: notification.read ? 'normal' : 'bold' },
                                            ]}
                                        >
                                            {notification.title}
                                        </Text>
                                        <Text style={styles.bodyText}>{notification.message}</Text>
                                        <Text style={[styles.bodyText, { fontSize: 12, marginTop: 4 }]}>
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </Text>

                                        <TouchableOpacity onPress={handleClick} >
                                            <Text>Review</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                            </View>
                        ))
                    )}


                </View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    textSection: {
        alignItems: 'flex-start',
        flex: 1,
    },
    bodyText: {
        fontSize: 16,
        color: '#5A5A5A',
        marginTop: 8,
        lineHeight: 22,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#800080',
        marginBottom: 4,
    },
    description: {
        fontSize: 15,
        color: '#5A5A5A',
        marginBottom: 16,
        lineHeight: 22,
    },
    mythBox: {
        backgroundColor: '#FEE2E2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    factBox: {
        backgroundColor: '#DCFCE7',
        padding: 16,
        borderRadius: 12,
    },
    factRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: 5,
        marginTop: 2,
    },
    factText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
        paddingBottom: 10,
        lineHeight: 22,
    },
});
