import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../navigation/AuthContext';
 
import { useGetUsersQuery } from '../../store/services/user/userApi';
import { useCreateQuestionnaireMutation } from '../../store/services/questionnaire/questionnaireApi';

const CreateQuestionnaire = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();
  const [createQuestionnaire, { isLoading }] = useCreateQuestionnaireMutation();
  const { data: adminData } = useGetUsersQuery({
    page: 1,
    limit: 100,
    role: 'admin',
  });

  const [admins, setAdmins] = useState([]);
  const [showReligionInput, setShowReligionInput] = useState(false);
  const [showTobaccoType, setShowTobaccoType] = useState(false);

  const [formData, setFormData] = useState({
    demographics: '',
    name: '',
    age: 0,
    gender: '',
    bloodGroup: '',
    idCardAvailable: '',
    cardNumber: '',
    religion: '',
    religion_input: '',
    education: '',
    occupation: '',
    income: 0,
    phoneNumber: '',
    address: '',
    familyHistory: '',
    firstDegreeRelativeOralCancer: '',
    height: 0,
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
    presenceOfGumDisease: [],
    presenceOfFluorosis: '',
  });

  useEffect(() => {
    if (adminData?.users) {
      setAdmins(adminData.users);
    }
  }, [adminData]);

  const handleChange = (name: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Show/hide religion input based on selection
    if (name === 'religion') {
      setShowReligionInput(value === 'Others');
    }
    
    // Show/hide tobacco type based on selection
    if (name === 'tobaccoChewer') {
      setShowTobaccoType(value === 'yes');
    }
  };

  const handleGumDiseaseChange = (value: string, isChecked: boolean) => {
    setFormData((prev) => {
      const currentValues = prev.presenceOfGumDisease || [];
      if (isChecked) {
        return { ...prev, presenceOfGumDisease: [...currentValues, value] };
      } else {
        return { 
          ...prev, 
          presenceOfGumDisease: currentValues.filter(item => item !== value) 
        };
      }
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'name', 'age', 'gender', 'bloodGroup', 'idCardAvailable', 'cardNumber',
      'religion', 'education', 'occupation', 'income', 'phoneNumber', 'address',
      'firstDegreeRelativeOralCancer', 'height', 'diabetes', 'hypertension',
      'dietHistory', 'fruitsConsumption', 'vegetableConsumption',
      'discontinuedHabit', 'durationOfDiscontinuingHabit', 'alcoholConsumption',
      'smoking', 'presenceOfLesion', 'reductionInMouthOpening', 'suddenWeightLoss',
      'presenceOfSharpTeeth', 'presenceOfDecayedTeeth', 'presenceOfFluorosis'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        Alert.alert('Validation Error', `${field} is required`);
        return false;
      }
    }

    if (formData.religion === 'Others' && !formData.religion_input) {
      Alert.alert('Validation Error', 'Please specify your religion');
      return false;
    }

    if (formData.tobaccoChewer === 'yes' && !formData.tobaccoType) {
      Alert.alert('Validation Error', 'Please specify tobacco type');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();

      // Append all fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, value.join(','));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      formDataToSend.append('send_to', JSON.stringify(admins.map((a) => a._id)));
      formDataToSend.append('submitted_by', user.id);


    


    

      await createQuestionnaire(formDataToSend).unwrap();

       
                             
                     
                           

      
      Alert.alert('Success', 'Questionnaire created successfully!');
      navigation.navigate('CreateQuestionnaire')
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit questionnaire');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Patient Questionnaire</Text>

 
      <Text style={styles.sectionHeader}>Demographics</Text>
      <TextInput
        style={styles.input}
        value={formData.demographics}
        onChangeText={(text) => handleChange('demographics', text)}
        placeholder="Demographics"
      />
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Full name"
      />

      <Text style={styles.label}>Age *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.age}
          onValueChange={(value) => handleChange('age', value)}
        >
          <Picker.Item label="Select age..." value={0} />
          {Array.from({ length: 71 }, (_, i) => (
            <Picker.Item key={i} label={`${i}`} value={i} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Gender *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.gender === 'male' && styles.radioButtonSelected]}
          onPress={() => handleChange('gender', 'male')}
        >
          <Text style={styles.radioText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.gender === 'female' && styles.radioButtonSelected]}
          onPress={() => handleChange('gender', 'female')}
        >
          <Text style={styles.radioText}>Female</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Blood Group *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.bloodGroup}
          onValueChange={(value) => handleChange('bloodGroup', value)}
        >
          <Picker.Item label="Select blood group..." value="" />
          <Picker.Item label="A+" value="a+" />
          <Picker.Item label="A-" value="a-" />
          <Picker.Item label="B+" value="b+" />
          <Picker.Item label="B-" value="b-" />
          <Picker.Item label="O+" value="o+" />
          <Picker.Item label="O-" value="o-" />
          <Picker.Item label="AB+" value="ab+" />
          <Picker.Item label="AB-" value="ab-" />
        </Picker>
      </View>

      <Text style={styles.label}>ID Card Available *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.idCardAvailable}
          onValueChange={(value) => handleChange('idCardAvailable', value)}
        >
          <Picker.Item label="Select ID card..." value="" />
          <Picker.Item label="Ayushman Bharat-PMJAY" value="Ayushman Bharat-PMJAY" />
          <Picker.Item label="ABHA card" value="ABHA card" />
          <Picker.Item label="AADHAR" value="AADHAR" />
          <Picker.Item label="Voter Id" value="Voter Id" />
        </Picker>
      </View>

      <Text style={styles.label}>Card Number *</Text>
      <TextInput
        style={styles.input}
        value={formData.cardNumber}
        onChangeText={(text) => handleChange('cardNumber', text)}
        placeholder="Enter card number"
      />

      <Text style={styles.label}>Religion *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.religion}
          onValueChange={(value) => handleChange('religion', value)}
        >
          <Picker.Item label="Select religion..." value="" />
          <Picker.Item label="Hindu" value="Hindu" />
          <Picker.Item label="Muslim" value="Muslim" />
          <Picker.Item label="Christianity" value="Christianity" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      {showReligionInput && (
        <>
          <Text style={styles.label}>Specify Religion *</Text>
          <TextInput
            style={styles.input}
            value={formData.religion_input}
            onChangeText={(text) => handleChange('religion_input', text)}
            placeholder="Enter your religion"
          />
        </>
      )}

      <Text style={styles.label}>Education *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.education}
          onValueChange={(value) => handleChange('education', value)}
        >
          <Picker.Item label="Select education level..." value="" />
          <Picker.Item label="Illiterate" value="Illiterate" />
          <Picker.Item label="Primary school certificate" value="Primary school certificate" />
          <Picker.Item label="Middle school certificate" value="Middle school certificate" />
          <Picker.Item label="High school certificate" value="High school certificate" />
          <Picker.Item label="Intermediate/ post high school diploma" value="Intermediate/ post high school diploma" />
          <Picker.Item label="Graduate/Post graduate" value="Graduate/Post graduate" />
          <Picker.Item label="Profession/Honours" value="Profession/Honours" />
        </Picker>
      </View>

      <Text style={styles.label}>Occupation *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.occupation}
          onValueChange={(value) => handleChange('occupation', value)}
        >
          <Picker.Item label="Select occupation..." value="" />
          <Picker.Item label="Unemployed" value="Unemployed" />
          <Picker.Item label="Elementary occupation" value="Elementary occupation" />
          <Picker.Item label="Plant and machine operators and assemblers" value="Plant and machine operators and assemblers" />
          <Picker.Item label="Craft and related trade workers" value="Craft and related trade workers" />
          <Picker.Item label="Skilled agricultural and fishery workers" value="Skilled agricultural and fishery workers" />
          <Picker.Item label="Skilled and shop and market sale workers" value="Skilled and shop and market sale workers" />
          <Picker.Item label="Clerks" value="Clerks" />
          <Picker.Item label="Technicians and Associate professionals" value="Technicians and Associate professionals" />
          <Picker.Item label="Professionals" value="Professionals" />
          <Picker.Item label="Legislators, senior officials and managers" value="Legislators, senior officials and managers" />
        </Picker>
      </View>

      <Text style={styles.label}>Income *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.income}
          onValueChange={(value) => handleChange('income', value)}
        >
          <Picker.Item label="Select income range..." value={0} />
          <Picker.Item label="<7,315" value={7315} />
          <Picker.Item label="7,316-21,913" value={21913} />
          <Picker.Item label="21,914-36,526" value={36526} />
          <Picker.Item label="36,527-45,588" value={45588} />
          <Picker.Item label="45,589-54,650" value={54650} />
          <Picker.Item label="54,651-59,251" value={59251} />
          <Picker.Item label="59,252-63,853" value={63853} />
          <Picker.Item label="63,854-68,454" value={68454} />
          <Picker.Item label="68,455-73,053" value={73053} />
          <Picker.Item label="73,054-1,09,579" value={109579} />
          <Picker.Item label="1,09,580-1,46,103" value={146103} />
          <Picker.Item label=">1,46,104" value={146104} />
        </Picker>
      </View>

      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        value={formData.phoneNumber}
        onChangeText={(text) => handleChange('phoneNumber', text)}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Address *</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={formData.address}
        onChangeText={(text) => handleChange('address', text)}
        placeholder="Enter full address"
        multiline
      />

      <Text style={styles.label}>Family History</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={formData.familyHistory}
        onChangeText={(text) => handleChange('familyHistory', text)}
        placeholder="Enter family medical history"
        multiline
      />

      <Text style={styles.label}>First Degree Relative with Oral Cancer *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.firstDegreeRelativeOralCancer}
          onValueChange={(value) => handleChange('firstDegreeRelativeOralCancer', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="Yes" value="yes" />
          <Picker.Item label="No" value="no" />
        </Picker>
      </View>

      {/* Medical Information */}
      <Text style={styles.sectionHeader}>Medical Information</Text>

      <Text style={styles.label}>Height (in cm) *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.height}
          onValueChange={(value) => handleChange('height', value)}
        >
          <Picker.Item label="Select height..." value={0} />
          {Array.from({ length: 150 }, (_, i) => (
            <Picker.Item key={i} label={`${i + 1} cm`} value={i + 1} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Diabetes *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.diabetes === 'yes' && styles.radioButtonSelected]}
          onPress={() => handleChange('diabetes', 'yes')}
        >
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.diabetes === 'no' && styles.radioButtonSelected]}
          onPress={() => handleChange('diabetes', 'no')}
        >
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Hypertension *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.hypertension === 'yes' && styles.radioButtonSelected]}
          onPress={() => handleChange('hypertension', 'yes')}
        >
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.hypertension === 'no' && styles.radioButtonSelected]}
          onPress={() => handleChange('hypertension', 'no')}
        >
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Diet History *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.dietHistory === 'Vegetarian' && styles.radioButtonSelected]}
          onPress={() => handleChange('dietHistory', 'Vegetarian')}
        >
          <Text style={styles.radioText}>Vegetarian</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.dietHistory === 'Mixed' && styles.radioButtonSelected]}
          onPress={() => handleChange('dietHistory', 'Mixed')}
        >
          <Text style={styles.radioText}>Mixed</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Fruits Consumption *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.fruitsConsumption}
          onValueChange={(value) => handleChange('fruitsConsumption', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="< 4 servings/week" value="< 4 servings/week" />
          <Picker.Item label="> 4 servings/week" value="> 4 servings/week" />
        </Picker>
      </View>

      <Text style={styles.label}>Vegetable Consumption *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.vegetableConsumption}
          onValueChange={(value) => handleChange('vegetableConsumption', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="< 4 servings/week" value="< 4 servings/week" />
          <Picker.Item label="> 4 servings/week" value="> 4 servings/week" />
        </Picker>
      </View>

      <Text style={styles.label}>Habit History</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={formData.habitHistory}
        onChangeText={(text) => handleChange('habitHistory', text)}
        placeholder="Enter habit history"
        multiline
      />

      <Text style={styles.label}>Tobacco Chewer</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.tobaccoChewer}
          onValueChange={(value) => handleChange('tobaccoChewer', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="Yes" value="yes" />
          <Picker.Item label="No" value="no" />
          <Picker.Item label="Discontinued habit" value="Discontinued habit" />
        </Picker>
      </View>

      {showTobaccoType && (
        <>
          <Text style={styles.label}>Tobacco Type *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.tobaccoType}
              onValueChange={(value) => handleChange('tobaccoType', value)}
            >
              <Picker.Item label="Select tobacco type..." value="" />
              <Picker.Item label="Unprocessed/ raw tobacco" value="Unprocessed/ raw tobacco" />
              <Picker.Item label="Gutkha" value="Gutkha" />
              <Picker.Item label="Pan masala" value="Pan masala" />
              <Picker.Item label="Areca nut only" value="Areca nut only" />
              <Picker.Item label="Betel quid (pan+areca nut+lime)" value="Betel quid (pan+areca nut+lime)" />
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Discontinued Habit *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.discontinuedHabit}
          onValueChange={(value) => handleChange('discontinuedHabit', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="Yes" value="yes" />
          <Picker.Item label="No" value="no" />
        </Picker>
      </View>

      <Text style={styles.label}>Duration of Discontinuing Habit *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.durationOfDiscontinuingHabit}
          onValueChange={(value) => handleChange('durationOfDiscontinuingHabit', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="< 1 year" value="< 1 year" />
          <Picker.Item label="1-3 years" value="1-3 years" />
          <Picker.Item label="3-5 years" value="3-5 years" />
        </Picker>
      </View>

      <Text style={styles.label}>Other Consumption History</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={formData.otherConsumptionHistory}
        onChangeText={(text) => handleChange('otherConsumptionHistory', text)}
        placeholder="Enter other consumption history"
        multiline
      />

      <Text style={styles.label}>Alcohol Consumption *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.alcoholConsumption}
          onValueChange={(value) => handleChange('alcoholConsumption', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="no" />
        </Picker>
      </View>

      <Text style={styles.label}>Smoking *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.smoking}
          onValueChange={(value) => handleChange('smoking', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="Yes" value="yes" />
          <Picker.Item label="No" value="no" />
        </Picker>
      </View>

      {/* Oral Examination */}
      <Text style={styles.sectionHeader}>Oral Examination</Text>

      <Text style={styles.label}>Oral Cavity Examination</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={formData.oralCavityExamination}
        onChangeText={(text) => handleChange('oralCavityExamination', text)}
        placeholder="Enter oral cavity examination details"
        multiline
      />

      <Text style={styles.label}>Presence of Lesion *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.presenceOfLesion}
          onValueChange={(value) => handleChange('presenceOfLesion', value)}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="white patch" value="white patch" />
          <Picker.Item label="red lesion" value="red lesion" />
          <Picker.Item label="tumour (> 2 cms)" value="tumour (> 2 cms)" />
          <Picker.Item label="ulcer (persistent more than 2 weeks)" value="ulcer (persistent more than 2 weeks)" />
        </Picker>
      </View>

      <Text style={styles.label}>Reduction in Mouth Opening *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.reductionInMouthOpening === 'yes' && styles.radioButtonSelected]}
          onPress={() => handleChange('reductionInMouthOpening', 'yes')}
        >
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.reductionInMouthOpening === 'no' && styles.radioButtonSelected]}
          onPress={() => handleChange('reductionInMouthOpening', 'no')}
        >
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Sudden Weight Loss *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.suddenWeightLoss === 'yes' && styles.radioButtonSelected]}
          onPress={() => handleChange('suddenWeightLoss', 'yes')}
        >
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.suddenWeightLoss === 'no' && styles.radioButtonSelected]}
          onPress={() => handleChange('suddenWeightLoss', 'no')}
        >
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Presence of Sharp Teeth *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.presenceOfSharpTeeth === 'yes' && styles.radioButtonSelected]}
          onPress={() => handleChange('presenceOfSharpTeeth', 'yes')}
        >
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.presenceOfSharpTeeth === 'no' && styles.radioButtonSelected]}
          onPress={() => handleChange('presenceOfSharpTeeth', 'no')}
        >
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Presence of Decayed Teeth *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.presenceOfDecayedTeeth === 'yes' && styles.radioButtonSelected]}
          onPress={() => handleChange('presenceOfDecayedTeeth', 'yes')}
        >
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.presenceOfDecayedTeeth === 'no' && styles.radioButtonSelected]}
          onPress={() => handleChange('presenceOfDecayedTeeth', 'no')}
        >
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Presence of Gum Disease *</Text>
      <View style={styles.checkboxGroup}>
        {['No', 'Loose teeth', 'Bleeding gums on brushing', 'Bad breath'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.checkboxButton,
              formData.presenceOfGumDisease.includes(option) && styles.checkboxButtonSelected
            ]}
            onPress={() => handleGumDiseaseChange(option, !formData.presenceOfGumDisease.includes(option))}
          >
            <Text style={styles.checkboxText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Presence of Fluorosis *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, formData.presenceOfFluorosis === 'yes' && styles.radioButtonSelected]}
          onPress={() => handleChange('presenceOfFluorosis', 'yes')}
        >
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, formData.presenceOfFluorosis === 'no' && styles.radioButtonSelected]}
          onPress={() => handleChange('presenceOfFluorosis', 'no')}
        >
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.adminInfo}>
        This questionnaire will be sent to {admins.length} admin(s)
      </Text>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Questionnaire</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioText: {
    fontSize: 16,
  },
  checkboxGroup: {
    marginBottom: 16,
  },
  checkboxButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  checkboxButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007bff',
  },
  checkboxText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  adminInfo: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default CreateQuestionnaire;