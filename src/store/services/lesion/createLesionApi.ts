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
        fetchAllLesions: builder.query({
            query: () => '/api/lesion?page=1&limit=1000',
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
        deleteLesion: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/lesions/${id}`,
                method: 'DELETE',
            }),
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