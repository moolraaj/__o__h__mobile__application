import { GetUsersQueryParams, PaginatedUsersResponse } from '../../../utils/Types';
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



    loginUser: builder.mutation({
      query: ({ phoneNumber }) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: { phoneNumber },
      }),
    }),

    sendEmailVerification: builder.mutation({
      query: ({ userId }) => ({
        url: `/api/auth/register/send-verification/${userId}`,
        method: 'POST',
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
  useSendEmailVerificationMutation
} = userApi;
