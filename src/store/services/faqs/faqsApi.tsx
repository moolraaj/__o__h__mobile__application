import { apiSlice } from "../apiSlice";
export const faqsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFaqs: builder.query({
            query: ({ page, limit, lang }) => ({
                url: '/api/faqs',
                params: { page, limit, ...(lang && { lang }) },
            }),
            providesTags: ['Faqs'],
        }),

    }),
});

export const {
    useGetFaqsQuery,
} = faqsApi;