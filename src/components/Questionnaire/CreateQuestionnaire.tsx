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
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../navigation/AuthContext';

import { useGetUsersQuery } from '../../store/services/user/userApi';
import { useCreateQuestionnaireMutation } from '../../store/services/questionnaire/questionnaireApi';
import { ToastMessage } from '../../resuable/Toast';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';
import RadioButtonGroup from '../../common/RadioButtonGroup';
import CheckboxGroup from '../../common/CheckboxGroup';
 
import * as ImagePicker from 'react-native-image-picker';

const CreateQuestionnaire = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();
  const [createQuestionnaire, { isLoading }] = useCreateQuestionnaireMutation();
  const { data: adminData } = useGetUsersQuery({
    page: 1,
    limit: 100,
    role: 'admin',
  });

  const [admins, setAdmins] = useState<Users[]>([]);
  const [showReligionInput, setShowReligionInput] = useState(false);
  const [showTobaccoType, setShowTobaccoType] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const [formData, setFormData] = useState<CreateUpdateQuestionnaire>({
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

  const selectImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 5,
        includeBase64: true,
      });

      if (!result.didCancel && !result.errorCode) {
        const selectedImages = result.assets || [];
        setImages(prev => [...prev, ...selectedImages]);
      }
    } catch (err) {
      console.error('Image picker error:', err);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };



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
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, value.join(','));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });
      formDataToSend.append('send_to', JSON.stringify(admins.map((a) => a._id)));
      if (user && user.id) {
        formDataToSend.append('submitted_by', user.id);
      } else {
        Alert.alert('Error', 'User information is missing. Please log in again.');
        return;
      }
      images.forEach((image, index) => {
        formDataToSend.append('images', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      });
      await createQuestionnaire(formDataToSend).unwrap();

      ToastMessage('success', 'Questionnaire created successfully!')
      navigation.navigate('AllQuestionnaire')
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit questionnaire');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

      <LinearGradient
        colors={['#56235E', '#C1392D']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>Patient Questionnaire</Text>
        <Text style={styles.subtitle}>Fill in the patient details below</Text>
      </LinearGradient>

      <Text style={styles.sectionHeader}>
        <GradientText text="Personal Information" size={20} />
      </Text>

      <Text style={styles.sectionHeader}>
        <GradientText text="Upload Images" size={20} />
      </Text>

      <TouchableOpacity style={styles.imageUploadButton} onPress={selectImages}>
        <Text style={styles.imageUploadButtonText}>Select Images (Max 5)</Text>
      </TouchableOpacity>

      <View style={styles.imagePreviewContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imagePreviewWrapper}>
            <Image
              source={{ uri: image.uri }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.removeImageButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Demographics *</Text>
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

      <RadioButtonGroup
        label="Gender *"
        options={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'femaile' },
        ]}
        selectedValue={formData.gender}
        onChange={(value) => handleChange('gender', value)}
      />

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
      <Text style={styles.sectionHeader}>
        <GradientText text="Medical Information" size={20} />
      </Text>
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


      <RadioButtonGroup
        label="Do you have Diabetes? *"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        selectedValue={formData.diabetes}
        onChange={(value) => handleChange('diabetes', value)}
      />

      <RadioButtonGroup
        label="Do you have hypertension? *"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        selectedValue={formData.hypertension}
        onChange={(value) => handleChange('hypertension', value)}
      />

      <RadioButtonGroup
        label="Diet History*"
        options={[
          { label: 'Vegetarian', value: 'vegetarian' },
          { label: 'Mixed', value: 'mixed' },
        ]}
        selectedValue={formData.dietHistory}
        onChange={(value) => handleChange('dietHistory', value)}
      />

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
      <Text style={styles.sectionHeader}>
        <GradientText text="Oral Examination" size={20} />
      </Text>
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

      <RadioButtonGroup
        label="Reduction in Mouth Opening? *"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        selectedValue={formData.reductionInMouthOpening}
        onChange={(value) => handleChange('reductionInMouthOpening', value)}
      />

      <RadioButtonGroup
        label="Sudden Weight Loss? *"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        selectedValue={formData.suddenWeightLoss}
        onChange={(value) => handleChange('suddenWeightLoss', value)}
      />

      <RadioButtonGroup
        label="Presence of Sharp Teeth? *"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        selectedValue={formData.presenceOfSharpTeeth}
        onChange={(value) => handleChange('presenceOfSharpTeeth', value)}
      />

      <RadioButtonGroup
        label="Presence of Decayed Teeth? *"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        selectedValue={formData.presenceOfDecayedTeeth}
        onChange={(value) => handleChange('presenceOfDecayedTeeth', value)}
      />

      <CheckboxGroup
        label="Presence of Gum Disease *"
        options={[
          { label: 'No', value: 'No' },
          { label: 'Loose teeth', value: 'Loose teeth' },
          { label: 'Bleeding gums on brushing', value: 'Bleeding gums on brushing' },
          { label: 'Bad breath', value: 'Bad breath' },
        ]}
        selectedValues={formData.presenceOfGumDisease}
        onChange={(values) => handleChange('presenceOfGumDisease', values)}
      />

      <RadioButtonGroup
        label="Presence of Fluorosis? *"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        selectedValue={formData.presenceOfFluorosis}
        onChange={(value) => handleChange('presenceOfFluorosis', value)}
      />

      <Text style={styles.adminInfo}>
        This questionnaire will be sent to {admins.length} admin(s)
      </Text>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <LinearGradient
          colors={['#56235E', '#C1392D']}
          locations={[0.2081, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitButton}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Questionnaire</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  header: {
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#56235E',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
  },
  radioButtonSelected: {
    borderColor: '#56235E',
    backgroundColor: '#F8E4FF',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#56235E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#56235E',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
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
  imageUploadButton: {
    backgroundColor: '#56235E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageUploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imagePreviewWrapper: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateQuestionnaire;