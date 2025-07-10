import {apiSlice} from '../apiSlice';

import {
  CustomUser,
  FollowMutationPayload,
  Message,
  SearchUserListType,
  SearchUserPageParam,
  UpdatePasswordPayload,
  UpdateUserPayload,
} from '../../../types/types';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsersMe: builder.query<CustomUser, void>({
      query: () => 'users/me',
      providesTags: ['Users'],
    }),
    createFollow: builder.mutation<Message, FollowMutationPayload>({
      query: ({user_id}) => ({
        url: `users/${user_id}/followers`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, {username}) =>
        username
          ? [
              {type: 'Followers', id: username},
              {type: 'Following', id: username},
              {type: 'Profile', id: username},
            ]
          : [],
    }),
    deleteFollow: builder.mutation<Message, FollowMutationPayload>({
      query: ({user_id}) => ({
        url: `users/${user_id}/followers`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, {username}) =>
        username
          ? [
              {type: 'Followers', id: username},
              {type: 'Following', id: username},
              {type: 'Profile', id: username},
            ]
          : [],
    }),
    updateUserMe: builder.mutation<CustomUser, UpdateUserPayload>({
      query: body => ({
        url: `users/me`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        {type: 'Users'},
        {type: 'Posts' as const, id: 'LIST'},
        {type: 'Profile', id: 'All'},
      ],
    }),
    updatePassword: builder.mutation<Message, UpdatePasswordPayload>({
      query: body => ({
        url: `users/me/password`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteAccount: builder.mutation<Message, void>({
      query: () => ({
        url: `users/me`,
        method: 'DELETE',
      }),
    }),
    searchUsers: builder.infiniteQuery<
      SearchUserListType,
      string,
      SearchUserPageParam
    >({
      query: ({pageParam: {limit, skip}, queryArg: query}) => {
        const params = new URLSearchParams();
        params.append('query', query.toString());
        if (skip) params.append('offset', skip.toString());
        if (limit) params.append('limit', limit.toString());

        return `users/search?${params.toString()}`;
      },
      infiniteQueryOptions: {
        initialPageParam: {limit: 20, skip: 0},
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          //allPageParam,
          //queryArg: string,
        ) => {
          if (lastPage.count < lastPageParam.limit) {
            return undefined;
          }
          const lastPost = lastPage.data.at(-1);

          if (!lastPost) {
            console.warn(
              'No last post found on the last page, stopping pagination.',
            );
            return undefined;
          }

          return {
            limit: lastPageParam.limit,
            skip: lastPageParam.skip + lastPage.count,
          };
        },
      },
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
  useSearchUsersInfiniteQuery,
} = usersApi;
