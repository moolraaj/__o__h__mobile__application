import { apiSlice } from "../apiSlice";
 
export const sliderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLesions: builder.query<LesionResponse, GetSlidersQueryParams>({
      query: ({ page = 1, limit = 10,  lang }) => ({
        url: '/api/lesion',
        params: { page, limit,   ...(lang && { lang }) },
      }),
      providesTags: ['Lesions'],
    }),
  }),
});

export const { 
  useGetLesionsQuery, 
} = sliderApi;
