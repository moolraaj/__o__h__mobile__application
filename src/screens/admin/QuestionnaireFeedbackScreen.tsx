import React, { useState } from 'react';
import { useRoute } from "@react-navigation/native";
import { Layout } from "../../common/Layout";
import { Text, View, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useGetAdminQuestionnaireByIdQuery, useSendQuestionnaireFeedbackMutation } from "../../store/services/questionnaire/questionnaireApi";
import GradientText from "../../common/GradientText";
import Loader from '../../common/Loader';
import { ToastMessage } from '../../resuable/Toast';

export const QuestionnaireFeedbackScreen = ({ navigation }: { navigation: any }) => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { data } = useGetAdminQuestionnaireByIdQuery(id);

  const [formData, setFormData] = useState({
    questionary_type: '',
    diagnosis_notes: '',
    recomanded_actions: '',
    comments_or_notes: '',
  });

  const [sendFeedback, { isLoading }] = useSendQuestionnaireFeedbackMutation();

  const handleSubmit = async () => {
    const form = new FormData();
    form.append('questionary_type', formData.questionary_type);
    form.append('diagnosis_notes', formData.diagnosis_notes);
    form.append('recomanded_actions', formData.recomanded_actions);
    form.append('comments_or_notes', formData.comments_or_notes);

    console.log(`form`)
    console.log(form)

    try {
      let resp = await sendFeedback({ id, formData: form }).unwrap();

      if (resp) {
        ToastMessage('success', resp?.message)
      }

      console.log(`resp`)
      console.log(resp)
      navigation.navigate('AdminQuestion')

    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  if (!data) {
    return (
      <Layout>
        <Text>Loading...</Text>
      </Layout>
    );
  }

  const questionnaire = data.data;

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <GradientText text="Personal Information" size={16} colors={['#5E346D', '#C13439']} />
          {[
            ['Name', questionnaire.name],
            ['Age', questionnaire.age],
            ['Gender', questionnaire.gender],
            ['Blood Group', questionnaire.bloodGroup],
            ['ID Card Available', questionnaire.idCardAvailable],
            ['Card Number', questionnaire.cardNumber],
            ['Religion', questionnaire.religion],
            ['Education', questionnaire.education],
            ['Occupation', questionnaire.occupation],
            ['Income', questionnaire.income],
            ['Phone Number', questionnaire.phoneNumber],
            ['Address', questionnaire.address],
          ].map(([label, value], idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>{label}:</Text>
              <Text style={styles.value}>{value || 'N/A'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <GradientText text="Medical History" size={16} colors={['#5E346D', '#C13439']} />
          {[
            ['Family History', questionnaire.familyHistory],
            ['First-degree Relative with Oral Cancer', questionnaire.firstDegreeRelativeOralCancer],
            ['Height', questionnaire.height],
            ['Diabetes', questionnaire.diabetes],
            ['Hypertension', questionnaire.hypertension],
          ].map(([label, value], idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>{label}:</Text>
              <Text style={styles.value}>{value || 'N/A'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <GradientText text="Diet History" size={16} colors={['#5E346D', '#C13439']} />
          {[
            ['Diet History', questionnaire.dietHistory],
            ['Fruits Consumption', questionnaire.fruitsConsumption],
            ['Vegetable Consumption', questionnaire.vegetableConsumption],
          ].map(([label, value], idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>{label}:</Text>
              <Text style={styles.value}>{value || 'N/A'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <GradientText text="Habit History" size={16} colors={['#5E346D', '#C13439']} />
          {[
            ['Habit History', questionnaire.habitHistory],
            ['Tobacco Chewer', questionnaire.tobaccoChewer],
            ['Tobacco Type', questionnaire.tobaccoType],
            ['Discontinued Habit', questionnaire.discontinuedHabit],
            ['Duration of Discontinuing Habit', questionnaire.durationOfDiscontinuingHabit],
            ['Other Consumption History', questionnaire.otherConsumptionHistory],
            ['Alcohol Consumption', questionnaire.alcoholConsumption],
            ['Smoking', questionnaire.smoking],
          ].map(([label, value], idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>{label}:</Text>
              <Text style={styles.value}>{value || 'N/A'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <GradientText text="Oral Examination" size={16} colors={['#5E346D', '#C13439']} />
          {[
            ['Oral Cavity Examination', questionnaire.oralCavityExamination],
            ['Presence of Lesion', questionnaire.presenceOfLesion],
            ['Reduction in Mouth Opening', questionnaire.reductionInMouthOpening],
            ['Sudden Weight Loss', questionnaire.suddenWeightLoss],
            ['Presence of Sharp Teeth', questionnaire.presenceOfSharpTeeth],
            ['Presence of Decayed Teeth', questionnaire.presenceOfDecayedTeeth],
            ['Presence of Fluorosis', questionnaire.presenceOfFluorosis],
            ['Presence of Gum Disease', questionnaire.presenceOfGumDisease?.join(', ')],
          ].map(([label, value], idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>{label}:</Text>
              <Text style={styles.value}>{value || 'N/A'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <GradientText text="Additional Information" size={16} colors={['#5E346D', '#C13439']} />
          {[
            ['Case Number', questionnaire.case_number],
            ['Submitted By', questionnaire.submitted_by?.name],
            ['Assigned To', questionnaire.assignTo?.name],
            ['Comments/Notes', questionnaire.comments_or_notes],
            ['Diagnosis Notes', questionnaire.diagnosis_notes],
            ['Questionnaire Type', questionnaire.questionary_type],
            ['Recommended Actions', questionnaire.recomanded_actions],
          ].map(([label, value], idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>{label}:</Text>
              <Text style={styles.value}>{value || 'N/A'}</Text>
            </View>
          ))}
        </View>


      </ScrollView>

      <ScrollView style={modalStyles.scrollContainer}>
        <View style={modalStyles.inputGroup}>
          <GradientText text="Questionary Type:" size={14} colors={['#5E346D', '#C13439']} />
          <TextInput
            style={modalStyles.input}
            value={formData.questionary_type}
            onChangeText={(text) => setFormData({ ...formData, questionary_type: text })}
            placeholder="Enter questionary type"
          />
        </View>

        <View style={modalStyles.inputGroup}>
          <GradientText text="Diagnosis Notes:" size={14} colors={['#5E346D', '#C13439']} />
          <TextInput
            style={[modalStyles.input, modalStyles.multilineInput]}
            value={formData.diagnosis_notes}
            onChangeText={(text) => setFormData({ ...formData, diagnosis_notes: text })}
            placeholder="Enter diagnosis notes"
            multiline
          />
        </View>

        <View style={modalStyles.inputGroup}>
          <GradientText text="Recommended Actions:" size={14} colors={['#5E346D', '#C13439']} />
          <TextInput
            style={[modalStyles.input, modalStyles.multilineInput]}
            value={formData.recomanded_actions}
            onChangeText={(text) => setFormData({ ...formData, recomanded_actions: text })}
            placeholder="Enter recommended actions"
            multiline
          />
        </View>

        <View style={modalStyles.inputGroup}>
          <GradientText text="Comments/Notes:" size={14} colors={['#5E346D', '#C13439']} />
          <TextInput
            style={[modalStyles.input, modalStyles.multilineInput]}
            value={formData.comments_or_notes}
            onChangeText={(text) => setFormData({ ...formData, comments_or_notes: text })}
            placeholder="Enter additional comments"
            multiline
          />
        </View>
      </ScrollView>

      <View style={modalStyles.buttonContainer}>
        <Pressable
          style={[modalStyles.button, modalStyles.cancelButton]}

          disabled={isLoading}
        >
          <Text style={modalStyles.buttonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[modalStyles.button, modalStyles.submitButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#6a3093" />
            </View>
          ) : (
            <Text style={modalStyles.buttonText}>Submit Feedback</Text>
          )}
        </Pressable>
      </View>

    </Layout>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    color: '#660033',
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    color: '#333',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#660033',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const modalStyles = StyleSheet.create({
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
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#660033',
    textAlign: 'center',
  },
  scrollContainer: {
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#660033',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default QuestionnaireFeedbackScreen;