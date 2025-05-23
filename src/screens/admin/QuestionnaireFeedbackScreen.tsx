 
import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';
 
import GradientText from '../../common/GradientText';
import { useSendQuestionnaireFeedbackMutation } from '../../store/services/questionnaire/questionnaireApi';
import Loader from '../../common/Loader';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  questionnaire: QuestionnaireTypes | null;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, onClose, questionnaire }) => {
  const [formData, setFormData] = useState({
    questionary_type: '',
    diagnosis_notes: '',
    recomanded_actions: '',
    comments_or_notes: '',
  });
  
  const [sendFeedback, { isLoading }] = useSendQuestionnaireFeedbackMutation();

  const handleSubmit = async () => {
    if (!questionnaire?._id) return;
    
    const form = new FormData();
    form.append('questionary_type', formData.questionary_type);
    form.append('diagnosis_notes', formData.diagnosis_notes);
    form.append('recomanded_actions', formData.recomanded_actions);
    form.append('comments_or_notes', formData.comments_or_notes);
    
    try {
      await sendFeedback({ id: questionnaire._id, formData: form }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Provide Feedback</Text>
          
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.inputGroup}>
              <GradientText text="Questionary Type:" size={14} colors={['#5E346D', '#C13439']} />
              <TextInput
                style={styles.input}
                value={formData.questionary_type}
                onChangeText={(text) => setFormData({...formData, questionary_type: text})}
                placeholder="Enter questionary type"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <GradientText text="Diagnosis Notes:" size={14} colors={['#5E346D', '#C13439']} />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={formData.diagnosis_notes}
                onChangeText={(text) => setFormData({...formData, diagnosis_notes: text})}
                placeholder="Enter diagnosis notes"
                multiline
              />
            </View>
            
            <View style={styles.inputGroup}>
              <GradientText text="Recommended Actions:" size={14} colors={['#5E346D', '#C13439']} />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={formData.recomanded_actions}
                onChangeText={(text) => setFormData({...formData, recomanded_actions: text})}
                placeholder="Enter recommended actions"
                multiline
              />
            </View>
            
            <View style={styles.inputGroup}>
              <GradientText text="Comments/Notes:" size={14} colors={['#5E346D', '#C13439']} />
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={formData.comments_or_notes}
                onChangeText={(text) => setFormData({...formData, comments_or_notes: text})}
                placeholder="Enter additional comments"
                multiline
              />
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Feedback</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default FeedbackModal;