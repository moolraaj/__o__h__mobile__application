 
import { apiSlice } from "../apiSlice";
 
 
export const habitHealthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHabitHealth: builder.query({
      query: ({ page = 1, limit = 10,  lang }) => ({
        url: '/api/habit-healths',
        params: { page, limit,   ...(lang && { lang }) },
      }),
      providesTags: ['HabitHealth']
    }),
    getSingleHabitHealth: builder.query ({
        query: ({ id, lang }) => ({
          url: `/api/habit-health/${id}`,
          params: lang ? { lang } : {},
        }),
        providesTags: ['HabitHealth'],
      }),
   
  }),
});

export const {useGetHabitHealthQuery,useGetSingleHabitHealthQuery} = habitHealthApi;
