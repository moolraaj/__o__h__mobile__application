import { apiSlice } from "../apiSlice";

export const privacyPolicy = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPrivacyPolices: builder.query({
            query: ({ page, limit, lang }) => ({
                url: '/api/privacy-policy/get',
                params: { page, limit, ...(lang && { lang }) },
            }),
            providesTags: ['PrivacyPolicy'],
        }),
    }),
});

export const {
    useGetPrivacyPolicesQuery,

} = privacyPolicy;