
import React, { useState } from 'react';
import { useRoute } from "@react-navigation/native";
import { Layout } from "../../common/Layout";
import { Text, View, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useGetAdminQuestionnaireByIdQuery, useSendQuestionnaireFeedbackMutation } from "../../store/services/questionnaire/questionnaireApi";
import GradientText from "../../common/GradientText";
import Loader from '../../common/Loader';
import { ToastMessage } from '../../resuable/Toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

  const [activeSection, setActiveSection] = useState('personal');
  const [sendFeedback, { isLoading }] = useSendQuestionnaireFeedbackMutation();

  const handleSubmit = async () => {
    const form = new FormData();
    form.append('questionary_type', formData.questionary_type);
    form.append('diagnosis_notes', formData.diagnosis_notes);
    form.append('recomanded_actions', formData.recomanded_actions);
    form.append('comments_or_notes', formData.comments_or_notes);

    try {
      let resp = await sendFeedback({ id, formData: form }).unwrap();
      if (resp) {
        ToastMessage('success', resp?.message)
      }
      navigation.navigate('AdminQuestion')
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  if (!data) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  const questionnaire = data.data;

  const renderSection = (section: string) => {
    switch (section) {
      case 'personal':
        return (
          <View style={styles.sectionContent}>
            {[
              ['Name', questionnaire.name],
              ['Age', questionnaire.age],
              ['Gender', questionnaire.gender],
              ['Blood Group', questionnaire.bloodGroup],
              ['ID Card', questionnaire.idCardAvailable],
              ['Card Number', questionnaire.cardNumber],
              ['Religion', questionnaire.religion],
              ['Education', questionnaire.education],
              ['Occupation', questionnaire.occupation],
              ['Income', questionnaire.income],
              ['Phone', questionnaire.phoneNumber],
              ['Address', questionnaire.address],
            ].map(([label, value], idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'N/A'}</Text>
              </View>
            ))}
          </View>
        );
      case 'medical':
        return (
          <View style={styles.sectionContent}>
            {[
              ['Family History', questionnaire.familyHistory],
              ['Oral Cancer Relative', questionnaire.firstDegreeRelativeOralCancer],
              ['Height', questionnaire.height],
              ['Diabetes', questionnaire.diabetes],
              ['Hypertension', questionnaire.hypertension],
            ].map(([label, value], idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'N/A'}</Text>
              </View>
            ))}
          </View>
        );
      case 'diet':
        return (
          <View style={styles.sectionContent}>
            {[
              ['Diet History', questionnaire.dietHistory],
              ['Fruits', questionnaire.fruitsConsumption],
              ['Vegetables', questionnaire.vegetableConsumption],
            ].map(([label, value], idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'N/A'}</Text>
              </View>
            ))}
          </View>
        );
      case 'habit':
        return (
          <View style={styles.sectionContent}>
            {[
              ['Habit History', questionnaire.habitHistory],
              ['Tobacco Chewer', questionnaire.tobaccoChewer],
              ['Tobacco Type', questionnaire.tobaccoType],
              ['Discontinued', questionnaire.discontinuedHabit],
              ['Duration Discontinued', questionnaire.durationOfDiscontinuingHabit],
              ['Other Consumption', questionnaire.otherConsumptionHistory],
              ['Alcohol', questionnaire.alcoholConsumption],
              ['Smoking', questionnaire.smoking],
            ].map(([label, value], idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'N/A'}</Text>
              </View>
            ))}
          </View>
        );
      case 'oral':
        return (
          <View style={styles.sectionContent}>
            {[
              ['Oral Examination', questionnaire.oralCavityExamination],
              ['Lesion Present', questionnaire.presenceOfLesion],
              ['Mouth Opening', questionnaire.reductionInMouthOpening],
              ['Weight Loss', questionnaire.suddenWeightLoss],
              ['Sharp Teeth', questionnaire.presenceOfSharpTeeth],
              ['Decayed Teeth', questionnaire.presenceOfDecayedTeeth],
              ['Fluorosis', questionnaire.presenceOfFluorosis],
              ['Gum Disease', questionnaire.presenceOfGumDisease?.join(', ')],
            ].map(([label, value], idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'N/A'}</Text>
              </View>
            ))}
          </View>
        );
      case 'additional':
        return (
          <View style={styles.sectionContent}>
            {[
              ['Case Number', questionnaire.case_number],
              ['Submitted By', questionnaire.submitted_by?.name],
              ['Assigned To', questionnaire.assignTo?.name],
              ['Comments', questionnaire.comments_or_notes],
              ['Diagnosis', questionnaire.diagnosis_notes],
              ['Questionnaire Type', questionnaire.questionary_type],
              ['Recommended Actions', questionnaire.recomanded_actions],
            ].map(([label, value], idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'N/A'}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <View style={styles.header}>
        <GradientText
          text="Patient Questionnaire Feedback"
          size={20}
          colors={['#5E346D', '#C13439']}
        />
        <Text style={styles.headerSubtitle}>Case ID: {questionnaire.case_number}</Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {[
            { id: 'personal', icon: 'person', label: 'Personal' },
            { id: 'medical', icon: 'medical-services', label: 'Medical' },
            { id: 'diet', icon: 'fastfood', label: 'Diet' },
            { id: 'habit', icon: 'smoking-rooms', label: 'Habits' },
            { id: 'oral', icon: 'dentistry', label: 'Oral' },
            { id: 'additional', icon: 'info', label: 'Additional' },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tabButton,
                activeSection === tab.id && styles.tabButtonActive
              ]}
              onPress={() => setActiveSection(tab.id)}
            >
              <MaterialIcons
                name={tab.icon}
                size={20}
                color={activeSection === tab.id ? '#fff' : '#660033'}
              />
              <Text style={[
                styles.tabText,
                activeSection === tab.id && styles.tabTextActive
              ]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.contentContainer}>
        {renderSection(activeSection)}

        <View style={styles.feedbackSection}>
          <GradientText
            text="Doctor's Feedback"
            size={18}
            colors={['#5E346D', '#C13439']}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Questionnaire Type</Text>
            <TextInput
              style={styles.input}
              value={formData.questionary_type}
              onChangeText={(text) => setFormData({ ...formData, questionary_type: text })}
              placeholder="Enter type (e.g., Initial Screening)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Diagnosis Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.diagnosis_notes}
              onChangeText={(text) => setFormData({ ...formData, diagnosis_notes: text })}
              placeholder="Detailed diagnosis notes..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recommended Actions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.recomanded_actions}
              onChangeText={(text) => setFormData({ ...formData, recomanded_actions: text })}
              placeholder="Recommended treatments or next steps..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Comments</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.comments_or_notes}
              onChangeText={(text) => setFormData({ ...formData, comments_or_notes: text })}
              placeholder="Any additional notes..."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.footerButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.footerButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[styles.footerButton, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialIcons name="send" size={12} color="#fff" />
              <Text style={styles.submitButtonText}> Submit Feedback</Text>
            </>
          )}
        </Pressable>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 14,
    marginVertical: 5
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabsScroll: {
    paddingVertical: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  tabButtonActive: {
    backgroundColor: '#660033',
    borderColor: '#5E346D',
  },
  tabText: {
    marginLeft: 6,
    color: '#660033',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  sectionContent: {
    backgroundColor: '#f9f5ff',
    borderRadius: 12,
    padding: 16,
    margin: 2,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    color: '#333',
    fontWeight: '600',
  },
  feedbackSection: {
    backgroundColor: '#f9f5ff',
    borderRadius: 12,
    padding: 16,
    margin: 2,
    marginVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#5E346D',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#5E346D',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#660033',
  },
  footerButtonText: {
    fontWeight: '400',
    fontSize: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 16,
  },
});

export default QuestionnaireFeedbackScreen;