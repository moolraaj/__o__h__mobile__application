 
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

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result?.error?.status === 401 || result?.error?.status === 403) {
    await AsyncStorage.multiRemove(['authToken', 'user'])
  }
  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User', 'Slider', 'TextSlider', 'Disease', 'Category',
    'HabitHealth', 'Lesions', 'Questions', 'MythsFacts',
    'Questionnaire', 'Dental', 'Faqs', 'Terms', 'PrivacyPolicy','Notifications',
 
  ],
  endpoints: () => ({}),
})