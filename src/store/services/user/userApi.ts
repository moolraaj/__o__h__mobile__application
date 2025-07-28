import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiSlice } from '../apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getUsers: builder.query<PaginatedUsersResponse, GetUsersQueryParams>({
      query: ({ page = 1, limit = 10, role }) => {
        const params: { page: number; limit: number; role?: string } = { page, limit };
        if (role) params.role = role;
        return {
          url: '/api/auth/users',
          params,
        };
      },
      providesTags: ['User'],
    }),


    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),


    sendOtp: builder.mutation({
      query: ({ phoneNumber }) => ({
        url: '/api/otpless/send-otp',
        method: 'POST',
        body: { phoneNumber },
      }),
    }),


    verifyOtp: builder.mutation({
      query: ({ requestId, otp }) => ({
        url: '/api/otpless/verify-otp',
        method: 'POST',
        body: { requestId, otp },
      }),
    }),
    loginUser: builder.mutation<{ token: string; user: any; message?: string }, { phoneNumber?: string; email?: string; password?: string }>({
      query: ({ phoneNumber, email, password }) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: phoneNumber
          ? { phoneNumber }
          : { email, password },
      }),
    }),
    sendEmailVerification: builder.mutation({
      query: ({ userId }) => ({
        url: `/api/auth/register/send-verification/${userId}`,
        method: 'POST',
      }),

    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/api/auth/users/${userId}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getSingleUser: builder.query({
      query: (userId) => `/api/auth/users/${userId}`,
      providesTags: ['User'],
    }),


    forgotPassword: builder.mutation<{ status: number; message: string }, { email: string }>({
      query: ({ email }) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<{ status: number; message: string; user?: { id: string; email: string; name: string } }, { otp: string; newPassword: string; confirmPassword: string }>({
      query: ({ otp, newPassword, confirmPassword }) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body: { otp, newPassword, confirmPassword },
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query({
      query: () => '/api/auth/profile',


      transformResponse: (response) => {

        AsyncStorage.setItem('user', JSON.stringify(response.user))
        return response
      },
    }),

    updateFcmToken: builder.mutation<{ status: number; message: string }, { userId: string; fcmToken: string; headers?: Record<string, string> }>({
      query: ({ userId, fcmToken, headers }) => ({
        url: `/api/users/${userId}/fcm-token`,
        method: "PATCH",
        body: { fcmToken },
        headers
      }),
    }),


  }),
});

export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useSendEmailVerificationMutation,
  useUpdateUserMutation,
  useGetSingleUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateFcmTokenMutation
} = userApi;
