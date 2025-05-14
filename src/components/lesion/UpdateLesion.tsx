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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  useGetLesionByIdQuery,
  useUpdateLesionMutation,
} from '../../store/services/lesion/createLesionApi';
import { useRoute } from '@react-navigation/native';

const UpdateLesion = ({ navigation }:{navigation:any}) => {
  const { lesionId } = useRoute().params as { lesionId: string };
  const { data, isLoading } = useGetLesionByIdQuery(lesionId);
  const [updateLesion, { isLoading: isUpdating }] = useUpdateLesionMutation();

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
        dental_images: (lesion.dental_images || []).map((img) =>
          typeof img === 'string' ? { uri: img } : img
        ),
      });
    }
  }, [data]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 5,
    });

    if (!result.didCancel && result.assets) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri.startsWith('file://') ? asset.uri : `file://${asset.uri}`,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
      }));

      setFormData((prev) => ({
        ...prev,
        dental_images: [...prev.dental_images, ...newImages],
      }));
    }
  };

  const removeImage = (index) => {
    const updated = [...formData.dental_images];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, dental_images: updated }));
  };

  const handleUpdate = async () => {
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'dental_images' && value !== undefined && value !== null) {
        form.append(key, value);
      }
    });

    formData.dental_images.forEach((img, i) => {
      if (img.uri?.startsWith('http')) return; // skip already uploaded images
      form.append('dental_images', {
        uri: img.uri,
        name: img.name || `image_${i}.jpg`,
        type: img.type || 'image/jpeg',
      });
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

  if (isLoading) return <ActivityIndicator size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Lesion</Text>

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
        keyboardType="numeric"
        placeholder="Enter age"
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
          <Picker.Item label="Other" value="other" />
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
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Add Image</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {formData.dental_images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
              <Text style={styles.removeImageText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isUpdating && { backgroundColor: '#6c757d' }]}
        onPress={handleUpdate}
        disabled={isUpdating}
      >
        <Text style={styles.buttonText}>
          {isUpdating ? 'Updating...' : 'Update Lesion'}
        </Text>
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
});

export default UpdateLesion;
