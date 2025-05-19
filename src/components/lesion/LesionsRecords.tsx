import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import {
  useFetchAllLesionsQuery,
  useSubmitLesionMutation,
  useDeleteLesionMutation,
} from '../../store/services/lesion/createLesionApi';
import { ToastMessage } from '../../resuable/Toast';

const AllLesionsRecords = ({ navigation }: { navigation: any }) => {
  const { data, isLoading, error, refetch } = useFetchAllLesionsQuery({});
  const [submitLesion] = useSubmitLesionMutation();
  const [deleteLesion] = useDeleteLesionMutation();
  const [sendingId, setSendingId] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSend = async (id: string) => {
    try {
      setSendingId(id);
      const res = await submitLesion(id).unwrap();
      if (isMounted.current) {
        Alert.alert('Success', res.message || 'Lesion submitted successfully');
      }
      await refetch();
    } catch (err: any) {
      const message = err?.data?.message || err?.error || 'Failed to submit lesion';
      if (isMounted.current) {
        Alert.alert('Error', message);
      }
    } finally {
      setSendingId(null);
    }
  };

  const handleConfirmedDelete = async (id: string) => {
    try {
    
      const result = await deleteLesion(id).unwrap();

      console.log(result)
   

      await refetch();

      if (isMounted.current) {
          ToastMessage('success', `Lesion deleted`);
      }
    } catch (err: any) {
      console.error('Delete error:', err);  
      const message = err?.data?.message || err?.error || 'Failed to delete lesion';
      if (isMounted.current) {
        Alert.alert('Error', message);
      }
    }
  };

  const handleDelete = (id: string) => {
    console.log('Preparing to show delete alert for ID:', id);
    InteractionManager.runAfterInteractions(() => {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this lesion?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => handleConfirmedDelete(id),
          },
        ],
        { cancelable: true }
      );
    });
  };

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading lesions</Text>;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateLesion')}
      >
        <Text style={styles.createButtonText}>+ Create Lesion</Text>
      </TouchableOpacity>

      <FlatList
        data={data?.lesions || []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subtitle}>Patient Name: {item.fullname}</Text>
            <Text style={styles.subtitle}>Age: {item.age}</Text>
            <Text style={styles.subtitle}>Gender: {item.gender}</Text>
            <Text style={styles.subtitle}>Symptoms: {item.symptoms}</Text>
            <Text style={styles.statusText}>
              Status: {item.status === 'submit' ? '✅ Submitted' : '⏳ Not Submitted'}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() =>
                  navigation.navigate('SingleLesionRecord', { lesionId: item._id })
                }
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('UpdateLesionRecord', { lesionId: item._id })
                }
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (item.status === 'submit' || sendingId === item._id) &&
                  styles.sendButtonDisabled,
                ]}
                disabled={item.status === 'submit' || sendingId === item._id}
                onPress={() => handleSend(item._id)}
              >
                <Text style={styles.buttonText}>
                  {item.status === 'submit'
                    ? 'Sent'
                    : sendingId === item._id
                      ? 'Sending...'
                      : 'Send'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: '#17a2b8',
    padding: 12,
    alignItems: 'center',
    margin: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  statusText: {
    fontSize: 13,
    marginTop: 4,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    flexGrow: 1,
    alignItems: 'center',
    margin: 3,
  },
  editButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 6,
    flexGrow: 1,
    alignItems: 'center',
    margin: 3,
  },
  sendButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    flexGrow: 1,
    alignItems: 'center',
    margin: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#999',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 6,
    flexGrow: 1,
    alignItems: 'center',
    margin: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default AllLesionsRecords;
