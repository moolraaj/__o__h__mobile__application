import { apiSlice } from "../apiSlice";

export const sliderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuestions: builder.query<QuestionnaireResponse, GetSlidersQueryParams>({
            query: ({ page = 1, limit = 10, lang }) => ({
                url: '/api/questionnaire',
                params: { page, limit, ...(lang && { lang }) },
            }),
            providesTags: ['Questions'],
        }),
    }),
});

export const {
    useGetQuestionsQuery,
} = sliderApi;
