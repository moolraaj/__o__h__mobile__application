import { apiSlice } from "../apiSlice";


export const dentalEmergencyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDentalEmergency: builder.query({
            query: ({ page = 1, limit = 10, lang }) => ({
                url: '/api/dental-emergency',
                params: { page, limit, ...(lang && { lang }) },
            }),
            providesTags: ['Dental'],
        }),
        getSingleDentalEmergency: builder.query<{ data: DiseaseTypes }, { id: string; lang?: string }>({
            query: ({ id, lang }) => ({
                url: `/api/dental-emergency/${id}`,
                params: lang ? { lang } : {},
            }),
            providesTags: ['Dental'],
        }),

    }),
});

export const { useGetDentalEmergencyQuery, useGetSingleDentalEmergencyQuery } = dentalEmergencyApi;
