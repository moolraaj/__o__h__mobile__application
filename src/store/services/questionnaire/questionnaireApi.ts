 
 
import { apiSlice } from '../apiSlice';

export const questionnaireApi = apiSlice.injectEndpoints({
 
  endpoints: (builder) => ({
    getQuestionnaires: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 100 }) => `/questionnaire?page=${page}&limit=${limit}`,
      providesTags: ['Questionnaire'],
    }),
    createQuestionnaire: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/questionnaire/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
  }),
});

export const {
  useGetQuestionnairesQuery,
  useCreateQuestionnaireMutation,
} = questionnaireApi;
