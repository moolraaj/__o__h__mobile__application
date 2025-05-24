 
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('authToken')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User','Slider','TextSlider','Disease','Category','HabitHealth', 'Lesions', 'Questions', 'MythsFacts','Questionnaire','Dental'],
  endpoints: () => ({}),
})
