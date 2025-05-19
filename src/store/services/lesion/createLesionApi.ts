import { apiSlice } from "../apiSlice";


export const lesionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createLesion: builder.mutation({
            query: (data) => ({
                url: '/api/lesion/create',
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            invalidatesTags: ['Lesions'],
        }),
        fetchAllLesions: builder.query<LesionResponse, GetSlidersQueryParams>({
            query: ({ page = 1, limit = 10, lang }) => ({
                url: '/api/lesion',
                params: { page, limit, ...(lang && { lang }) },
            }),
            providesTags: ['Lesions'],
        }),

        getLesionById: builder.query({
            query: (id) => `/api/lesion/${id}`,
        }),
        submitLesion: builder.mutation({
            query: (id: string) => ({
                url: `/api/lesion/submit/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Lesions'],
        }),
        deleteLesion: builder.mutation({
            query: (id) => ({
                url: `/api/lesion/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Lesions'],
        }),


        updateLesion: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/lesion/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Lesions'],
        }),
    }),
});

export const { useCreateLesionMutation, useFetchAllLesionsQuery, useGetLesionByIdQuery, useSubmitLesionMutation, useDeleteLesionMutation, useUpdateLesionMutation } = lesionApi;