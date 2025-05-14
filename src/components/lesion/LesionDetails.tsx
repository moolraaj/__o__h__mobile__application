 
import { useGetLesionByIdQuery } from '../../store/services/lesion/createLesionApi';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
 

const LesionDetails  = () => {
   const { lesionId } = useRoute().params as { lesionId: string };  
 

  const { data, isLoading, error } = useGetLesionByIdQuery(lesionId);
  
  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading lesion details</Text>;
  
  let {lesion}=data
  
  console.log(lesion)
  return (
    <View style={{ padding: 16 }}>
      <Text >Patient name {lesion.fullname}</Text>
      <Text>Age: {lesion.age}</Text>
      <Text>Symptoms: {lesion.symptoms}</Text>
      <Text>previous dental treatement: {lesion.previous_dental_treatement}</Text>
      <Text>status: {lesion.status}</Text>
      <Text>location: {lesion.location}</Text>
      <Text>gender: {lesion.gender}</Text>
      <Text>existing habits: {lesion.existing_habits}</Text>
      <Text>disease time: {lesion.disease_time}</Text>
      <Text>contact number: {lesion.contact_number}</Text>
     
    </View>
  );
};

export default LesionDetails;
