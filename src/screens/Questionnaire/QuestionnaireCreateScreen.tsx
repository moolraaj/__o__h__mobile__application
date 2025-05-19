import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
 
import { useGetUsersQuery } from '../../store/services/user/userApi';
import { useAuth } from '../../navigation/AuthContext';
import { useCreateQuestionnaireMutation } from '../../store/services/questionnaire/questionnaireApi';

export default function CreateQuestionnaire({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [createQuestionnaire, { isLoading }] = useCreateQuestionnaireMutation();
  const { data: adminData } = useGetUsersQuery({ page: 1, limit: 100, role: 'admin' });

  const [admins, setAdmins] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
    idCardAvailable: '',
    cardNumber: '',
    religion: '',
    religion_input: '',
    education: '',
    occupation: '',
    income: '',
    phoneNumber: '',
    address: '',
    familyHistory: '',
    firstDegreeRelativeOralCancer: '',
    height: '',
    diabetes: '',
    hypertension: '',
    dietHistory: '',
    fruitsConsumption: '',
    vegetableConsumption: '',
    habitHistory: '',
    tobaccoChewer: '',
    tobaccoType: '',
    discontinuedHabit: '',
    durationOfDiscontinuingHabit: '',
    otherConsumptionHistory: '',
    alcoholConsumption: '',
    smoking: '',
    oralCavityExamination: '',
    presenceOfLesion: '',
    reductionInMouthOpening: '',
    suddenWeightLoss: '',
    presenceOfSharpTeeth: '',
    presenceOfDecayedTeeth: '',
    presenceOfFluorosis: '',
    presenceOfGumDisease: '',
    demographics: '',
  });

  useEffect(() => {
    if (adminData?.users) {
      setAdmins(adminData.users);
      setIsLoadingAdmins(false);
    }
  }, [adminData]);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'presenceOfGumDisease') {
        formData.append('presenceOfGumDisease', value);  
      } else {
        formData.append(key, value);
      }
    });

    formData.append('send_to', JSON.stringify(admins.map((admin) => admin._id)));
    formData.append('submitted_by', user.id);

    try {
      await createQuestionnaire(formData).unwrap();
      Alert.alert('Success', 'Questionnaire submitted successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error?.data?.message || 'Failed to create questionnaire');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Questionnaire</Text>

      {Object.entries(form).map(([key, value]) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleChange(key, text)}
            placeholder={`Enter ${key}`}
          />
        </View>
      ))}

      {isLoadingAdmins ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.loadingText}>Loading admin list...</Text>
        </View>
      ) : (
        <Text style={styles.adminInfo}>This form will be sent to {admins.length} admin(s).</Text>
      )}

      <TouchableOpacity
        style={[styles.submitButton, (isLoading || isLoadingAdmins) && { backgroundColor: '#777' }]}
        onPress={handleSubmit}
        disabled={isLoading || isLoadingAdmins}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Questionnaire</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 4, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'center',
  },
  loadingText: { marginLeft: 10, color: '#007bff' },
  adminInfo: { marginTop: 10, color: '#555', textAlign: 'center' },
});
