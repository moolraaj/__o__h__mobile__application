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
        url: `/api/notifications/${user_id}/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
    reviewNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/api/notifications/update/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),

  }),
});

export const {
  useGetAllNotificationsQuery,
  useDeleteNotificationMutation,
  useReviewNotificationMutation
} = notificationsApi;
