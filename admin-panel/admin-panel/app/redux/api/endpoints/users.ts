import { apiSlice } from "../apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersMe: builder.query<CustomUser, void>({
      query: () => "users/me",
      providesTags: ["Users"],
    }),
    updateUserMe: builder.mutation<CustomUser, UpdateUserPayload>({
      query: (body) => ({
        url: `users/me`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Users" },
        { type: "Posts" as const, id: "LIST" },
      ],
    }),
    updatePassword: builder.mutation<Message, UpdatePasswordPayload>({
      query: (body) => ({
        url: `users/me/password`,
        method: "PATCH",
        body,
      }),
    }),
    deleteAccount: builder.mutation<Message, void>({
      query: () => ({
        url: `users/me`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersMeQuery,
  useCreateFollowMutation,
  useDeleteFollowMutation,
  useUpdateUserMeMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
} = usersApi;
