import { apiSlice } from "../apiSlice";


export const termAndConditionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTerms: builder.query({
            query: ({ page, limit, lang }) => ({
                url: '/api/terms/get',
                params: { page, limit, ...(lang && { lang }) },
            }),
            providesTags: ['Terms'],
        }),
    }),
});
export const {
    useGetTermsQuery,
} = termAndConditionApi;