import { apiSlice } from '../apiSlice';

export const questionnaireApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionnaires: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 100 }) => `/api/questionnaire?page=${page}&limit=${limit}`,
      providesTags: ['Questionnaire'],
    }),
    createQuestionnaire: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/api/questionnaire/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    deleteQuestionnaire: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/questionnaire/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    getQuestionnaire: builder.query<any, string>({
      query: (id) => `/api/questionnaire/${id}`,
      providesTags: ['Questionnaire'],
    }),
    submitQuestionnaire: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/questionnaire/submit/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    updateQuestionnaire: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/questionnaire/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
  }),
});

export const {
  useGetQuestionnairesQuery,
  useCreateQuestionnaireMutation,
  useDeleteQuestionnaireMutation,
  useGetQuestionnaireQuery,
  useSubmitQuestionnaireMutation,
  useUpdateQuestionnaireMutation
} = questionnaireApi;