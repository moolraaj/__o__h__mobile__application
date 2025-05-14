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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../navigation/AuthContext';
import { useCreateLesionMutation } from '../../store/services/lesion/createLesionApi';
import { useGetUsersQuery } from '../../store/services/user/userApi';

const CreateLesion = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
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

  const [admins, setAdmins] = useState([]);
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

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Image Picker with Clean Format
  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5,
      });

      if (!result.didCancel && result.assets) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
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

  const removeImage = (index) => {
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
      formDataToSend.append('submitted_by', user.id);

      // ✅ Append cleaned image objects
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
      Alert.alert('Error', error?.data?.message || 'Failed to create lesion');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Lesion</Text>

      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.fullname}
        onChangeText={(text) => handleChange('fullname', text)}
        placeholder="Enter full name"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={formData.age}
        onChangeText={(text) => handleChange('age', text)}
        placeholder="Enter age"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(value) => handleChange('gender', value)}
          style={styles.picker}
        >
          <Picker.Item label="Select gender..." value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        value={formData.contact_number}
        onChangeText={(text) => handleChange('contact_number', text)}
        placeholder="Enter contact number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={formData.location}
        onChangeText={(text) => handleChange('location', text)}
        placeholder="Enter location"
      />

      <Text style={styles.label}>Symptoms *</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={formData.symptoms}
        onChangeText={(text) => handleChange('symptoms', text)}
        placeholder="Describe symptoms"
        multiline
      />

      <Text style={styles.label}>Disease Time</Text>
      <TextInput
        style={styles.input}
        value={formData.disease_time}
        onChangeText={(text) => handleChange('disease_time', text)}
        placeholder="How long has the condition existed?"
      />

      <Text style={styles.label}>Existing Habits</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={formData.existing_habits}
        onChangeText={(text) => handleChange('existing_habits', text)}
        placeholder="Describe any relevant habits"
        multiline
      />

      <Text style={styles.label}>Previous Dental Treatment</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={formData.previous_dental_treatement}
        onChangeText={(text) => handleChange('previous_dental_treatement', text)}
        placeholder="Describe any previous dental treatments"
        multiline
      />

      <Text style={styles.label}>Dental Images</Text>
      <TouchableOpacity
        style={styles.imageButton}
        onPress={pickImage}
        disabled={isCreatingLesion}
      >
        <Text style={styles.buttonText}>Add Image</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {formData.dental_images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.removeImageText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {isLoadingAdmins ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.loadingText}>Loading admin data...</Text>
        </View>
      ) : (
        <Text style={styles.adminInfo}>
          This lesion will be sent to {admins.length} admin(s)
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (isCreatingLesion || isLoadingAdmins) && { backgroundColor: '#6c757d' },
        ]}
        onPress={handleSubmit}
        disabled={isCreatingLesion || isLoadingAdmins}
      >
        {isCreatingLesion ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Lesion</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  imageContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: { width: 100, height: 100 },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: { color: 'white', fontWeight: 'bold' },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  loadingText: { marginLeft: 10, color: '#007bff' },
  adminInfo: { textAlign: 'center', marginVertical: 15, color: '#555' },
});

export default CreateLesion;
