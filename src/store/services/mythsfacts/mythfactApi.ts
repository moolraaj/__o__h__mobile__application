import { apiSlice } from "../apiSlice";

export const sliderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMythsAndFacts: builder.query<MythsResponse, GetSlidersQueryParams>({
            query: ({ page = 1, limit = 10, lang }) => ({
                url: '/api/myth-facts',
                params: { page, limit, ...(lang && { lang }) },
            }),
            providesTags: ['MythsFacts'],
        }),
    }),
});

export const {
    useGetMythsAndFactsQuery,
} = sliderApi;
