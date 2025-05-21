// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { launchImageLibrary } from 'react-native-image-picker';
// import {
//   useGetLesionByIdQuery,
//   useUpdateLesionMutation,
// } from '../../store/services/lesion/createLesionApi';
// import { useRoute } from '@react-navigation/native';

// const UpdateLesion = ({ navigation }:{navigation:any}) => {
//   const { lesionId } = useRoute().params as { lesionId: string };
//   const { data, isLoading } = useGetLesionByIdQuery(lesionId);
//   const [updateLesion, { isLoading: isUpdating }] = useUpdateLesionMutation();

//   type DentalImage = {
//     uri: string;
//     name?: string;
//     type?: string;
//   };
  
//   type FormDataType = {
//     fullname: string;
//     age: string;
//     gender: string;
//     contact_number: string;
//     location: string;
//     symptoms: string;
//     disease_time: string;
//     existing_habits: string;
//     previous_dental_treatement: string;
//     dental_images: DentalImage[];
//   };
  
//   const [formData, setFormData] = useState<FormDataType>({
//     fullname: '',
//     age: '',
//     gender: '',
//     contact_number: '',
//     location: '',
//     symptoms: '',
//     disease_time: '',
//     existing_habits: '',
//     previous_dental_treatement: '',
//     dental_images: [],
//   });

//   useEffect(() => {
//     if (data?.lesion) {
//       const lesion = data.lesion;
//       setFormData({
//         fullname: lesion.fullname || '',
//         age: lesion.age?.toString() || '',
//         gender: lesion.gender || '',
//         contact_number: lesion.contact_number || '',
//         location: lesion.location || '',
//         symptoms: lesion.symptoms || '',
//         disease_time: lesion.disease_time || '',
//         existing_habits: lesion.existing_habits || '',
//         previous_dental_treatement: lesion.previous_dental_treatement || '',
//         dental_images: lesion.dental_images || [],
//       });
//     }
//   }, [data]);
//   const pickImage = async () => {
//     const result = await launchImageLibrary({
//       mediaType: 'photo',
//       quality: 0.8,
//       selectionLimit: 5,
//     });

//     if (!result.didCancel && result.assets) {
//       const newImages = result.assets
//         .filter((asset) => !!asset.uri)
//         .map((asset) => ({
//           uri: asset.uri!.startsWith('file://') ? asset.uri! : `file://${asset.uri}`,
//           name: asset.fileName || `image_${Date.now()}.jpg`,
//           type: asset.type || 'image/jpeg',
//         }));

//       setFormData((prev) => ({
//         ...prev,
//         dental_images: [...prev.dental_images, ...newImages],
//       }));
//     }
//   };

//   const removeImage = (index: number) => {
//     const updated = [...formData.dental_images];
//     updated.splice(index, 1);
//     setFormData((prev) => ({ ...prev, dental_images: updated }));
//   };

//   const handleUpdate = async () => {
//     const form = new FormData();

//     Object.entries(formData).forEach(([key, value]) => {
//       if (key !== 'dental_images' && value !== undefined && value !== null) {
//         form.append(key, value);
//       }
//     });

//     formData.dental_images.forEach((img, i) => {
//       if (img.uri?.startsWith('http')) return; // skip already uploaded images
//       form.append('dental_images', {
//         uri: img.uri,
//         name: img.name || `image_${i}.jpg`,
//         type: img.type || 'image/jpeg',
//       });
//     });

//     try {
//       await updateLesion({ id: lesionId, data: form }).unwrap();
//       Alert.alert('Success', 'Lesion updated successfully');
//       navigation.navigate('AllLesions');
//     } catch (err) {
//       console.error('Update failed:', err);
//       Alert.alert('Error', 'Failed to update lesion');
//     }
//   };

//   if (isLoading) return <ActivityIndicator size="large" />;

//   function handleChange(arg0: string, text: string): void {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Update Lesion</Text>

//       <Text style={styles.label}>Full Name *</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.fullname}
//         onChangeText={(text) => handleChange('fullname', text)}
//         placeholder="Enter full name"
//       />

//       <Text style={styles.label}>Age</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.age}
//         onChangeText={(text) => handleChange('age', text)}
//         keyboardType="numeric"
//         placeholder="Enter age"
//       />

//       <Text style={styles.label}>Gender</Text>
//       <View style={styles.pickerWrapper}>
//         <Picker
//           selectedValue={formData.gender}
//           onValueChange={(value) => handleChange('gender', value)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select gender..." value="" />
//           <Picker.Item label="Male" value="male" />
//           <Picker.Item label="Female" value="female" />
//           <Picker.Item label="Other" value="other" />
//         </Picker>
//       </View>

//       <Text style={styles.label}>Contact Number</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.contact_number}
//         onChangeText={(text) => handleChange('contact_number', text)}
//         placeholder="Enter contact number"
//         keyboardType="phone-pad"
//       />

//       <Text style={styles.label}>Location</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.location}
//         onChangeText={(text) => handleChange('location', text)}
//         placeholder="Enter location"
//       />

//       <Text style={styles.label}>Symptoms *</Text>
//       <TextInput
//         style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
//         value={formData.symptoms}
//         onChangeText={(text) => handleChange('symptoms', text)}
//         placeholder="Describe symptoms"
//         multiline
//       />

//       <Text style={styles.label}>Disease Time</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.disease_time}
//         onChangeText={(text) => handleChange('disease_time', text)}
//         placeholder="How long has the condition existed?"
//       />

//       <Text style={styles.label}>Existing Habits</Text>
//       <TextInput
//         style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
//         value={formData.existing_habits}
//         onChangeText={(text) => handleChange('existing_habits', text)}
//         placeholder="Describe any relevant habits"
//         multiline
//       />

//       <Text style={styles.label}>Previous Dental Treatment</Text>
//       <TextInput
//         style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
//         value={formData.previous_dental_treatement}
//         onChangeText={(text) => handleChange('previous_dental_treatement', text)}
//         placeholder="Describe any previous dental treatments"
//         multiline
//       />

//       <Text style={styles.label}>Dental Images</Text>
//       <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
//         <Text style={styles.buttonText}>Add Image</Text>
//       </TouchableOpacity>

//       <View style={styles.imageContainer}>
//         {formData.dental_images.map((image, index) => (
//           <View key={index} style={styles.imageWrapper}>
//             <Image source={{ uri: image.uri }} style={styles.image} />
//             <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
//               <Text style={styles.removeImageText}>×</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>

//       <TouchableOpacity
//         style={[styles.submitButton, isUpdating && { backgroundColor: '#6c757d' }]}
//         onPress={handleUpdate}
//         disabled={isUpdating}
//       >
//         <Text style={styles.buttonText}>
//           {isUpdating ? 'Updating...' : 'Update Lesion'}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20, paddingBottom: 40 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   pickerWrapper: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   imageButton: {
//     backgroundColor: '#007bff',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   submitButton: {
//     backgroundColor: '#28a745',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
//   imageContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
//   imageWrapper: {
//     position: 'relative',
//     marginRight: 12,
//     marginBottom: 12,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   image: { width: 100, height: 100 },
//   removeImageButton: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: 'red',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   removeImageText: { color: 'white', fontWeight: 'bold' },
// });

// export default UpdateLesion;























import React, { useEffect, useState } from 'react';
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
import { useGetLesionByIdQuery, useUpdateLesionMutation } from '../../store/services/lesion/createLesionApi';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../common/GradientText';

type DentalImage = {
  uri: string;
  name?: string;
  type?: string;
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

const UpdateLesion = ({ navigation }: { navigation: any }) => {
  const { lesionId } = useRoute().params as { lesionId: string };
  const { data, isLoading } = useGetLesionByIdQuery(lesionId);
  const [updateLesion, { isLoading: isUpdating }] = useUpdateLesionMutation();

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

  useEffect(() => {
    if (data?.lesion) {
      const lesion = data.lesion;
      setFormData({
        fullname: lesion.fullname || '',
        age: lesion.age?.toString() || '',
        gender: lesion.gender || '',
        contact_number: lesion.contact_number || '',
        location: lesion.location || '',
        symptoms: lesion.symptoms || '',
        disease_time: lesion.disease_time || '',
        existing_habits: lesion.existing_habits || '',
        previous_dental_treatement: lesion.previous_dental_treatement || '',
        dental_images: lesion.dental_images || [],
      });
    }
  }, [data]);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 5 - formData.dental_images.length,
    });

    if (!result.didCancel && result.assets) {
      const newImages = result.assets
        .filter((asset) => !!asset.uri)
        .map((asset) => ({
          uri: asset.uri!,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
        }));

      setFormData((prev) => ({
        ...prev,
        dental_images: [...prev.dental_images, ...newImages],
      }));
    }
  };

  const removeImage = (index: number) => {
    const updated = [...formData.dental_images];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, dental_images: updated }));
  };

  const handleChange = (name: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) {
      Alert.alert('Validation Error', 'Full name is required');
      return false;
    }
    if (!formData.symptoms.trim()) {
      Alert.alert('Validation Error', 'Symptoms description is required');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'dental_images' && value !== undefined && value !== null) {
        form.append(key, value);
      }
    });

    formData.dental_images.forEach((img, i) => {
      if (img.uri?.startsWith('http')) {
        // For already uploaded images, just send the URI
        form.append('dental_images[]', img.uri);
      } else {
        // For new images, append the file object
        form.append('dental_images', {
          uri: img.uri,
          name: img.name || `image_${i}.jpg`,
          type: img.type || 'image/jpeg',
        });
      }
    });

    try {
      await updateLesion({ id: lesionId, data: form }).unwrap();
      Alert.alert('Success', 'Lesion updated successfully');
      navigation.navigate('AllLesions');
    } catch (err) {
      console.error('Update failed:', err);
      Alert.alert('Error', 'Failed to update lesion');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#56235E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#56235E', '#C1392D']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>Update Lesion Report</Text>
        <Text style={styles.subtitle}>Update the patient details below</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <View style={styles.inputContainer}>
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
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Age</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>
                <GradientText text={<Icon name="cake" size={20} color='#56235E' />} size={20} />
              </Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => handleChange('age', text)}
                placeholder="Age"
                placeholderTextColor="#adb5bd"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Gender</Text>
            <View style={[styles.inputContainer, { paddingLeft: 10 }]}>
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
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>
              <GradientText text={<Icon name="phone" size={20} color='#56235E' />} size={20} />
            </Text>
            <TextInput
              style={styles.input}
              value={formData.contact_number}
              onChangeText={(text) => handleChange('contact_number', text)}
              placeholder="Phone number"
              placeholderTextColor="#adb5bd"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.inputContainer}>
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
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Symptoms *</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
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
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Duration of Condition</Text>
          <View style={styles.inputContainer}>
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
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Existing Habits</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
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
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Previous Dental Treatment</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
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
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dental Images</Text>
          <Text style={styles.imageSubtext}>Upload clear photos of the affected area (max 5)</Text>

          <TouchableOpacity
            onPress={pickImage}
            disabled={isUpdating || formData.dental_images.length >= 5}
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

        <TouchableOpacity
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          <LinearGradient
            colors={['#56235E', '#C1392D']}
            locations={[0.2081, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.submitButton,
              isUpdating && styles.submitButtonDisabled,
            ]}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="save" size={20} color="white" />
                <Text style={styles.buttonText}> Update Report</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Reuse the same styles from CreateLesion
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    margin: 1
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
});

export default UpdateLesion;