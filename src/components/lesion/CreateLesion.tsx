import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../navigation/AuthContext';
import { useCreateLesionMutation } from '../../store/services/lesion/createLesionApi';
import { useGetUsersQuery } from '../../store/services/user/userApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';

type DentalImage = {
  uri: string;
  name: string;
  type: string;
};

type FormDataType = {
  fullname: string;
  age: string;
  gender: string;
  contact_number: string;
  location: string;
  symptoms: string;
  disease_time: string;
  existing_habits: string;
  previous_dental_treatement: string;
  dental_images: DentalImage[];
};

type FormErrors = {
  fullname?: string;
  age?: string;
  gender?: string;
  contact_number?: string;
  location?: string;
  symptoms?: string;
  disease_time?: string;
  existing_habits?: string;
  previous_dental_treatement?: string;
  dental_images?: string;
};

const CreateLesion = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldRefs = useRef<{ [key: string]: View | null }>({});

  const [formData, setFormData] = useState<FormDataType>({
    fullname: '',
    age: '',
    gender: '',
    contact_number: '',
    location: '',
    symptoms: '',
    disease_time: '',
    existing_habits: '',
    previous_dental_treatement: '',
    dental_images: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [admins, setAdmins] = useState<Users[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);

  const { data: adminData } = useGetUsersQuery({
    page: 1,
    limit: 100,
    role: 'admin',
  });

  const [createLesion, { isLoading: isCreatingLesion }] = useCreateLesionMutation();

  useEffect(() => {
    if (adminData?.users) {
      setAdmins(adminData.users);
      setIsLoadingAdmins(false);
    }
  }, [adminData]);

  const scrollToField = (fieldName: string) => {
    const fieldRef = fieldRefs.current[fieldName];
    if (fieldRef && scrollViewRef.current) {
      // Use findNodeHandle to get the native node handle
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { findNodeHandle } = require('react-native');
      const scrollViewNode = findNodeHandle(scrollViewRef.current);
      if (scrollViewNode) {
        fieldRef.measureLayout(
          scrollViewNode,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
          },
          () => { }
        );
      }
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateField = (name: string, value: string): string | undefined => {
    if (!value.trim()) {
      return 'This field is required';
    }

    if (name === 'contact_number') {
      if (!/^\d+$/.test(value)) {
        return 'Phone number should contain only numbers';
      }
      if (value.length !== 10) {
        return 'Phone number must be 10 digits';
      }
    }

    if (name === 'age') {
      const ageNum = parseInt(value);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 80) {
        return 'Please enter a valid age (1-80)';
      }
    }

    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      if (field !== 'dental_images') {
        const error = validateField(field, formData[field as keyof FormDataType] as string);
        if (error) {
          newErrors[field as keyof FormErrors] = error;
          isValid = false;
        }
      }
    });

    // Validate images
    if (formData.dental_images.length === 0) {
      newErrors.dental_images = 'At least one image is required';
      isValid = false;
    }

    setErrors(newErrors);

    // Scroll to first error
    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        setTimeout(() => scrollToField(firstErrorField), 100);
      }
    }

    return isValid;
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5,
        quality: 0.8,
      });

      if (!result.didCancel && result.assets) {
        const newImages = result.assets
          .filter((asset) => typeof asset.uri === 'string')
          .map((asset) => ({
            uri: asset.uri as string,
            name: asset.fileName || `image_${Date.now()}.jpg`,
            type: asset.type || 'image/jpeg',
          }));

        setFormData((prev) => ({
          ...prev,
          dental_images: [...prev.dental_images, ...newImages],
        }));
        // Clear image error if any
        if (errors.dental_images) {
          setErrors((prev) => ({ ...prev, dental_images: undefined }));
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Image selection failed');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.dental_images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, dental_images: newImages }));
  };

  const handleSubmit = async () => {
    if (!validateForm() || isLoadingAdmins) return;

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'dental_images') {
          formDataToSend.append(key, value);
        }
      });

      formDataToSend.append('send_to', JSON.stringify(admins.map((a) => a._id)));
      if (user && user.id) {
        formDataToSend.append('submitted_by', user.id);
      } else {
        throw new Error('User information is missing. Please log in again.');
      }

      formData.dental_images.forEach((file, idx) => {
        formDataToSend.append('dental_images', {
          uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`,
          name: file.name || `image_${Date.now()}_${idx}.jpg`,
          type: file.type || 'image/jpeg',
        });
      });

      await createLesion(formDataToSend).unwrap();
      Alert.alert('Success', 'Lesion created and sent to all admins!');
      navigation.navigate('AllLesions');
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage =
        (typeof error === 'object' &&
          error !== null &&
          'data' in error &&
          typeof (error as any).data === 'object' &&
          (error as any).data &&
          'message' in (error as any).data)
          ? (error as any).data.message
          : 'Failed to create lesion';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#56235E', '#C1392D']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>New Lesion Report</Text>
        <Text style={styles.subtitle}>Fill in all patient details below</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        {/* Full Name */}
        <View
          style={styles.formGroup}
          ref={ref => { fieldRefs.current.fullname = ref; }}
        >
          <Text style={styles.label}>Full Name *</Text>
          <View style={[
            styles.inputContainer,
            errors.fullname && styles.inputError
          ]}>
            <Text style={styles.inputIcon}>
              <GradientText text={<Icon name="person" size={20} color='#56235E' />} size={20} />
            </Text>
            <TextInput
              style={styles.input}
              value={formData.fullname}
              onChangeText={(text) => handleChange('fullname', text)}
              placeholder="Enter full name"
              placeholderTextColor="#adb5bd"
            />
          </View>
          {errors.fullname && <Text style={styles.errorText}>{errors.fullname}</Text>}
        </View>

        {/* Age and Gender Row */}
        <View style={styles.row}>
          <View
            style={[styles.formGroup, { flex: 1, marginRight: 10 }]}
            ref={ref => { fieldRefs.current.age = ref; }}
          >
            <Text style={styles.label}>Age *</Text>
            <View style={[
              styles.inputContainer,
              errors.age && styles.inputError
            ]}>
              <Text style={styles.inputIcon}>
                <GradientText text={<Icon name="cake" size={20} color='#56235E' />} size={20} />
              </Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => handleChange('age', text)}
                placeholder="Age (1-120)"
                placeholderTextColor="#adb5bd"
                keyboardType="numeric"
              />
            </View>
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          </View>

          <View
            style={[styles.formGroup, { flex: 1 }]}
            ref={ref => { fieldRefs.current.gender = ref; }}
          >
            <Text style={styles.label}>Gender *</Text>
            <View style={[
              styles.inputContainer,
              { paddingLeft: 10 },
              errors.gender && styles.inputError
            ]}>
              <Text style={styles.inputIcon}>
                <GradientText text={<Icon name="wc" size={20} color='#56235E' />} size={20} />
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                  style={[styles.picker, { color: formData.gender ? '#495057' : '#adb5bd' }]}
                  dropdownIconColor="#6c757d"
                  mode="dropdown"
                >
                  <Picker.Item label="Select gender..." value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>
        </View>

        {/* Contact Number */}
        <View
          style={styles.formGroup}
          ref={ref => { fieldRefs.current.contact_number = ref; }}
        >
          <Text style={styles.label}>Contact Number *</Text>
          <View style={[
            styles.inputContainer,
            errors.contact_number && styles.inputError
          ]}>
            <Text style={styles.inputIcon}>
              <GradientText text={<Icon name="phone" size={20} color='#56235E' />} size={20} />
            </Text>
            <TextInput
              style={styles.input}
              value={formData.contact_number}
              onChangeText={(text) => handleChange('contact_number', text)}
              placeholder="Phone number (10 digits)"
              placeholderTextColor="#adb5bd"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {errors.contact_number && <Text style={styles.errorText}>{errors.contact_number}</Text>}
        </View>

        {/* Location */}
        <View
          style={styles.formGroup}
          ref={ref => { fieldRefs.current.location = ref; }}
        >
          <Text style={styles.label}>Location *</Text>
          <View style={[
            styles.inputContainer,
            errors.location && styles.inputError
          ]}>
            <Text style={styles.inputIcon}>
              <GradientText text={<Icon name="location-on" size={20} color='#56235E' />} size={20} />
            </Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => handleChange('location', text)}
              placeholder="Patient's location"
              placeholderTextColor="#adb5bd"
            />
          </View>
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        {/* Symptoms */}
        <View
          style={styles.formGroup}
          ref={ref => { fieldRefs.current.symptoms = ref; }}
        >
          <Text style={styles.label}>Symptoms *</Text>
          <View style={[
            styles.inputContainer,
            styles.textAreaContainer,
            errors.symptoms && styles.inputError
          ]}>
            <Text style={styles.inputIcon}>
              <GradientText text={<Icon name="healing" size={20} color='#56235E' />} size={20} />
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.symptoms}
              onChangeText={(text) => handleChange('symptoms', text)}
              placeholder="Describe symptoms in detail"
              placeholderTextColor="#adb5bd"
              multiline
              numberOfLines={4}
            />
          </View>
          {errors.symptoms && <Text style={styles.errorText}>{errors.symptoms}</Text>}
        </View>

        {/* Disease Time */}
        <View
          style={styles.formGroup}
          ref={ref => { fieldRefs.current.disease_time = ref; }}
        >
          <Text style={styles.label}>Duration of Condition *</Text>
          <View style={[
            styles.inputContainer,
            errors.disease_time && styles.inputError
          ]}>
            <Text style={styles.inputIcon}>
              <GradientText text={<Icon name="access-time" size={20} color='#56235E' />} size={20} />
            </Text>
            <TextInput
              style={styles.input}
              value={formData.disease_time}
              onChangeText={(text) => handleChange('disease_time', text)}
              placeholder="How long has this been present?"
              placeholderTextColor="#adb5bd"
            />
          </View>
          {errors.disease_time && <Text style={styles.errorText}>{errors.disease_time}</Text>}
        </View>

        {/* Existing Habits */}
        <View
          style={styles.formGroup}
          ref={ref => { fieldRefs.current.existing_habits = ref; }}
        >
          <Text style={styles.label}>Existing Habits *</Text>
          <View style={[
            styles.inputContainer,
            styles.textAreaContainer,
            errors.existing_habits && styles.inputError
          ]}>
            <Text style={styles.inputIcon}>
              <GradientText text={<Icon name="smoking-rooms" size={20} color='#56235E' />} size={20} />
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.existing_habits}
              onChangeText={(text) => handleChange('existing_habits', text)}
              placeholder="Any relevant habits (smoking, etc.)"
              placeholderTextColor="#adb5bd"
              multiline
              numberOfLines={3}
            />
          </View>
          {errors.existing_habits && <Text style={styles.errorText}>{errors.existing_habits}</Text>}
        </View>

        {/* Previous Dental Treatment */}
        <View
          style={styles.formGroup}
          ref={ref => { fieldRefs.current.previous_dental_treatement = ref; }}
        >
          <Text style={styles.label}>Previous Dental Treatment *</Text>
          <View style={[
            styles.inputContainer,
            styles.textAreaContainer,
            errors.previous_dental_treatement && styles.inputError
          ]}>
            <Text style={styles.inputIcon}>
              <GradientText text={<Icon name="medical-services" size={20} color='#56235E' />} size={20} />
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.previous_dental_treatement}
              onChangeText={(text) => handleChange('previous_dental_treatement', text)}
              placeholder="Any previous dental treatments"
              placeholderTextColor="#adb5bd"
              multiline
              numberOfLines={3}
            />
          </View>
          {errors.previous_dental_treatement && <Text style={styles.errorText}>{errors.previous_dental_treatement}</Text>}
        </View>

        {/* Dental Images */}
        <View
          style={styles.formGroup}
          ref={ref => { fieldRefs.current.dental_images = ref; }}
        >
          <Text style={styles.label}>Dental Images *</Text>
          <Text style={styles.imageSubtext}>Upload clear photos of the affected area (max 5)</Text>

          <TouchableOpacity
            onPress={pickImage}
            disabled={isCreatingLesion || formData.dental_images.length >= 5}
          >
            <LinearGradient
              colors={['#56235E', '#C1392D']}
              locations={[0.2081, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.imageButton}
            >
              <Icon name="add-a-photo" size={20} color="white" />
              <Text style={styles.buttonText}> Add Images</Text>
            </LinearGradient>
          </TouchableOpacity>

          {errors.dental_images && <Text style={styles.errorText}>{errors.dental_images}</Text>}

          {formData.dental_images.length > 0 && (
            <View style={styles.imageContainer}>
              {formData.dental_images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Icon name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {isLoadingAdmins ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4a90e2" />
            <Text style={styles.loadingText}>Loading admin data...</Text>
          </View>
        ) : (
          <View style={styles.adminInfoContainer}>
            <GradientText text={<Icon name="admin-panel-settings" size={20} color="#4a90e2" />} size={20} />
            <Text style={styles.adminInfo}>
              This report will be sent to {admins.length} admin(s)
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isCreatingLesion || isLoadingAdmins}
        >
          <LinearGradient
            colors={['#56235E', '#C1392D']}
            locations={[0.2081, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.submitButton,
              (isCreatingLesion || isLoadingAdmins) && styles.submitButtonDisabled,
            ]}
          >
            {isCreatingLesion ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="send" size={20} color="white" />
                <Text style={styles.buttonText}> Submit Report</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  formContainer: {
    paddingBottom: 30,
  },
  formGroup: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
    marginLeft: 5,
  },
  imageSubtext: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 10,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 1.5,
    height: 45,
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 15,
    color: '#56235E',
    paddingVertical: 0,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
    width: '100%',
    color: '#56235E',
    ...Platform.select({
      ios: {
        height: 45,
      },
      android: {
        height: 45,
        marginTop: -8,
        marginBottom: -8,
      },
    }),
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    height: 'auto',
    minHeight: 100,
    paddingVertical: 10,
  },
  textArea: {
    height: 'auto',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#e9ecef',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(220,53,69,0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#495057',
    fontSize: 14,
  },
  adminInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f8ff',
    padding: 5,
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#d0e3ff',
  },
  adminInfo: {
    marginLeft: 8,
    color: '#495057',
    fontSize: 12,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    gap: 10
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
    shadowColor: '#6c757d',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
});

export default CreateLesion;