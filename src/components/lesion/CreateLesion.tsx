// import React, { useState, useEffect } from 'react';
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
// import { useAuth } from '../../navigation/AuthContext';
// import { useCreateLesionMutation } from '../../store/services/lesion/createLesionApi';
// import { useGetUsersQuery } from '../../store/services/user/userApi';

// type DentalImage = {
//   uri: string;
//   name: string;
//   type: string;
// };

// type FormDataType = {
//   fullname: string;
//   age: string;
//   gender: string;
//   contact_number: string;
//   location: string;
//   symptoms: string;
//   disease_time: string;
//   existing_habits: string;
//   previous_dental_treatement: string;
//   dental_images: DentalImage[];
// };

// const CreateLesion = ({ navigation }: { navigation: any }) => {
//   const { user } = useAuth();

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

//   const [admins, setAdmins] = useState<Users[]>([]);
//   const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);

//   const { data: adminData } = useGetUsersQuery({
//     page: 1,
//     limit: 100,
//     role: 'admin',
//   });

//   const [createLesion, { isLoading: isCreatingLesion }] = useCreateLesionMutation();

//   useEffect(() => {
//     if (adminData?.users) {
//       setAdmins(adminData.users);
//       setIsLoadingAdmins(false);
//     }
//   }, [adminData]);

//   const handleChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Image Picker with Clean Format
//   const pickImage = async () => {
//     try {
//       const result = await launchImageLibrary({
//         mediaType: 'photo',
//         selectionLimit: 5,
//       });

//       if (!result.didCancel && result.assets) {
//         const newImages = result.assets
//           .filter((asset) => typeof asset.uri === 'string')
//           .map((asset) => ({
//             uri: asset.uri as string,
//             name: asset.fileName || `image_${Date.now()}.jpg`,
//             type: asset.type || 'image/jpeg',
//           }));

//         setFormData((prev) => ({
//           ...prev,
//           dental_images: [...prev.dental_images, ...newImages],
//         }));
//       }
//     } catch (error) {
//       console.error('Error selecting image:', error);
//       Alert.alert('Error', 'Image selection failed');
//     }
//   };

//   const removeImage = (index: number) => {
//     const newImages = [...formData.dental_images];
//     newImages.splice(index, 1);
//     setFormData((prev) => ({ ...prev, dental_images: newImages }));
//   };

//   const validateForm = () => {
//     if (!formData.fullname.trim()) {
//       Alert.alert('Validation Error', 'Full name is required');
//       return false;
//     }
//     if (!formData.symptoms.trim()) {
//       Alert.alert('Validation Error', 'Symptoms description is required');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm() || isLoadingAdmins) return;

//     try {
//       const formDataToSend = new FormData();

//       Object.entries(formData).forEach(([key, value]) => {
//         if (key !== 'dental_images') {
//           formDataToSend.append(key, value);
//         }
//       });

//       formDataToSend.append('send_to', JSON.stringify(admins.map((a) => a._id)));
//       if (user && user.id) {
//         formDataToSend.append('submitted_by', user.id);
//       } else {
//         throw new Error('User information is missing. Please log in again.');
//       }

//       // ✅ Append cleaned image objects
//       formData.dental_images.forEach((file, idx) => {
//         formDataToSend.append('dental_images', {
//           uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`,
//           name: file.name || `image_${Date.now()}_${idx}.jpg`,
//           type: file.type || 'image/jpeg',
//         });
//       });

//       await createLesion(formDataToSend).unwrap();
//       Alert.alert('Success', 'Lesion created and sent to all admins!');
//       navigation.navigate('AllLesions');
//     } catch (error) {
//       console.error('Submit error:', error);
//       const errorMessage =
//         (typeof error === 'object' &&
//           error !== null &&
//           'data' in error &&
//           typeof (error as any).data === 'object' &&
//           (error as any).data &&
//           'message' in (error as any).data)
//           ? (error as any).data.message
//           : 'Failed to create lesion';
//       Alert.alert('Error', errorMessage);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Create New Lesion</Text>

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
//         placeholder="Enter age"
//         keyboardType="numeric"
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
//       <TouchableOpacity
//         style={styles.imageButton}
//         onPress={pickImage}
//         disabled={isCreatingLesion}
//       >
//         <Text style={styles.buttonText}>Add Image</Text>
//       </TouchableOpacity>

//       <View style={styles.imageContainer}>
//         {formData.dental_images.map((image, index) => (
//           <View key={index} style={styles.imageWrapper}>
//             <Image source={{ uri: image.uri }} style={styles.image} />
//             <TouchableOpacity
//               style={styles.removeImageButton}
//               onPress={() => removeImage(index)}
//             >
//               <Text style={styles.removeImageText}>×</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>

//       {isLoadingAdmins ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="small" color="#007bff" />
//           <Text style={styles.loadingText}>Loading admin data...</Text>
//         </View>
//       ) : (
//         <Text style={styles.adminInfo}>
//           This lesion will be sent to {admins.length} admin(s)
//         </Text>
//       )}

//       <TouchableOpacity
//         style={[
//           styles.submitButton,
//           (isCreatingLesion || isLoadingAdmins) && { backgroundColor: '#6c757d' },
//         ]}
//         onPress={handleSubmit}
//         disabled={isCreatingLesion || isLoadingAdmins}
//       >
//         {isCreatingLesion ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Submit Lesion</Text>
//         )}
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
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 15,
//   },
//   loadingText: { marginLeft: 10, color: '#007bff' },
//   adminInfo: { textAlign: 'center', marginVertical: 15, color: '#555' },
// });

// export default CreateLesion;















import React, { useState, useEffect } from 'react';
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

const CreateLesion = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();

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

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        <Text style={styles.subtitle}>Fill in the patient details below</Text>
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
    </ScrollView >
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
    // More subtle shadow
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
});

export default CreateLesion;