import { apiSlice } from "../apiSlice";
export const feaurecategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeatureCategory: builder.query({
      query: ({ page = 1, limit = 10,  lang }) => ({
        url: '/api/category',
        params: { page, limit,   ...(lang && { lang }) },
      }),
      providesTags: ['Category'],
    }),
    getSingleFeatureCategory: builder.query ({
      query: ({ id, lang }) => ({
        url: `/api/category/${id}`,
        params: lang ? { lang } : {},
      }),
      providesTags: ['Category'],
    }),
   
   
   
  }),
});

export const {useGetFeatureCategoryQuery,useGetSingleFeatureCategoryQuery} = feaurecategoryApi;
