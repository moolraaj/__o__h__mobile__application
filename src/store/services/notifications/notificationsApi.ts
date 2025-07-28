import { apiSlice } from "../apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: ({ page, limit, lang, user_id }) => ({
        url: `/api/notifications/get-all/${user_id}`,
        params: { page, limit, ...(lang && { lang }) },
      }),
      providesTags: ['Notifications'],
    }),

    deleteNotification: builder.mutation({
      query: ({ user_id, id }) => ({
        url: `/api/${user_id}/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useDeleteNotificationMutation,
} = notificationsApi;
