import { useGetLesionByIdQuery } from '../../store/services/lesion/createLesionApi';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  FlatList, 
  Image,
  StyleSheet,
  ScrollView 
} from 'react-native';

const LesionDetails = () => {
  const { lesionId } = useRoute().params as { lesionId: string };
  const { data, isLoading, error } = useGetLesionByIdQuery(lesionId);
  
  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading lesion details</Text>;
  
  const { lesion } = data;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Patient name: {lesion.fullname}</Text>
      <Text style={styles.text}>Age: {lesion.age}</Text>
      <Text style={styles.text}>Symptoms: {lesion.symptoms}</Text>
      <Text style={styles.text}>Previous dental treatment: {lesion.previous_dental_treatement}</Text>
      <Text style={styles.text}>Status: {lesion.status}</Text>
      <Text style={styles.text}>Location: {lesion.location}</Text>
      <Text style={styles.text}>Gender: {lesion.gender}</Text>
      <Text style={styles.text}>Existing habits: {lesion.existing_habits}</Text>
      <Text style={styles.text}>Disease time: {lesion.disease_time}</Text>
      <Text style={styles.text}>Contact number: {lesion.contact_number}</Text>

     
      <Text style={styles.sectionTitle}>Dental Images:</Text>
      <FlatList
        horizontal
        data={lesion.dental_images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image 
            source={{ uri: item }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
        contentContainerStyle={styles.imageList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  imageList: {
    paddingVertical: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 8,
    borderRadius: 8,
  },
});

export default LesionDetails;