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

    fetchAdminAllQuestionnaires: builder.query<{ data: any[]; page: number; limit: number; totalResults: number }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 100 }) => ({
        url: '/api/questionnaire/admin/get_all',
        params: { page, limit },
      }),
      providesTags: ['Questionnaire'],
    }),
    getAdminQuestionnaireById: builder.query({
      query: (id) => `/api/questionnaire/admin/${id}`,
      providesTags: ['Questionnaire'],
    }),
    sendQuestionnaireFeedback: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/questionnaire/${id}/feedback`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    takeoverQuestionnaire: builder.mutation<any, { id: string; adminId: string }>({
      query: ({ id, adminId }) => ({
        url: `/api/questionnaire/${id}/takeover`,
        method: 'PUT',
        body: { adminId },
      }),
      invalidatesTags: ['Questionnaire'],
    }),
    fetchDantaRecievedQuestionnaires: builder.query({
      query: (userId) => `/api/questionnaire/danta/${userId}`,
      providesTags: ['Questionnaire'],
    }),
  }),
});

export const {
  useGetQuestionnairesQuery,
  useCreateQuestionnaireMutation,
  useDeleteQuestionnaireMutation,
  useGetQuestionnaireQuery,
  useSubmitQuestionnaireMutation,
  useUpdateQuestionnaireMutation,
  useFetchAdminAllQuestionnairesQuery,
  useGetAdminQuestionnaireByIdQuery,
  useSendQuestionnaireFeedbackMutation,
  useTakeoverQuestionnaireMutation,
  useFetchDantaRecievedQuestionnairesQuery
} = questionnaireApi;