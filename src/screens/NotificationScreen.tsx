// import { View, Text } from 'react-native'
// import React from 'react'
// import { Layout } from '../common/Layout'

// export default function NotificationScreen() {
//     return (
//         <Layout>
//             <Text>NotificationScreen</Text>
//         </Layout>
//     )
// }







import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { Layout } from '../common/Layout'
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

export default function NotificationScreen() {
    // Dummy notifications data
    const notifications = [
        {
            id: 1,
            title: "New Update Available",
            message: "Version 2.3.0 is now available with new features and bug fixes.",
            time: "2 hours ago",
            read: false,
            icon: "update"
        },
        {
            id: 2,
            title: "Appointment Reminder",
            message: "Your appointment with Dr. Smith is scheduled for tomorrow at 10:00 AM.",
            time: "5 hours ago",
            read: true,
            icon: "event"
        },
        {
            id: 3,
            title: "Security Alert",
            message: "A new device logged into your account from New York. Contact support if this wasn't you.",
            time: "1 day ago",
            read: false,
            icon: "security"
        },
        {
            id: 4,
            title: "Weekly Summary",
            message: "Here's your weekly activity summary. You've completed 8 tasks this week!",
            time: "2 days ago",
            read: true,
            icon: "summarize"
        },
    ];

    return (
        <Layout>
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.header}>
                        <View style={styles.textSection}>
                            <Text style={styles.heading}>Notifications</Text>
                            <Text style={styles.description}>You have {notifications.filter(n => !n.read).length} unread notifications</Text>
                        </View>
                    </View>

                    {notifications.map((notification) => (
                        <View key={notification.id} style={[
                            styles.mythBox,
                            notification.read ? { backgroundColor: '#F3F4F6' } : { backgroundColor: '#E0E7FF' }
                        ]}>
                            <View style={styles.factRow}>
                                <MaterialIcons 
                                    name={notification.icon} 
                                    size={24} 
                                    color="#800080" 
                                    style={styles.icon} 
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.factText, { fontWeight: notification.read ? 'normal' : 'bold' }]}>
                                        {notification.title}
                                    </Text>
                                    <Text style={styles.bodyText}>{notification.message}</Text>
                                    <Text style={[styles.bodyText, { fontSize: 12, marginTop: 4 }]}>{notification.time}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    <View style={styles.factBox}>
                        <Text style={styles.heading}>Notification Tips</Text>
                        <Text style={styles.bodyText}>
                            • Swipe left to delete notifications{"\n"}
                            • Tap to mark as read{"\n"}
                            • Adjust settings to customize notifications
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </Layout>
    )
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
        lineHeight: 22
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 12,
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
        lineHeight: 22
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
        marginTop: 2
    },
    factText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: '#B1D6FF',
        borderStyle: 'dashed',
        paddingBottom: 10,
        lineHeight: 22
    },
});
