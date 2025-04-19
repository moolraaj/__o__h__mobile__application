import { apiSlice } from "../apiSlice";

 
export const textSliderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTextSlider: builder.query({
            query: ({ page = 1, limit = 10, lang }) => ({
                url: '/api/text-slides',
                params: { page, limit, ...(lang && { lang }) },
            }),
            providesTags: ['TextSlider'],
        }),

    }),
});
export const {
    useGetTextSliderQuery
} = textSliderApi;
