import {apiSlice} from '../apiSlice';

import {
  GetProfilePostRequestType,
  PostTypeWithCount,
  ProfileFollowersType,
  ProfileType,
} from '../../../types/types';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfileByUserName: builder.query<ProfileType, string>({
      query: username => `profiles/${username}`,
      providesTags: (result, error, username) => [
        {type: 'Profile', id: username},
      ],
    }),
    getProfilePostsByUserName: builder.query<
      PostTypeWithCount,
      GetProfilePostRequestType
    >({
      query: ({last_post_created_at, limit, username}) => {
        const params = new URLSearchParams();

        if (last_post_created_at) {
          params.append('last_post_created_at', last_post_created_at);
        }

        if (limit) {
          params.append('limit', limit.toString());
        }

        const queryString = params.toString();
        return queryString
          ? `profiles/${username}/posts?${queryString}`
          : `profiles/${username}/posts`;
      },
      providesTags: (result, error, {username}) => [
        {type: 'ProfilePosts', id: username},
      ],
    }),
    getProfileFollowers: builder.query<ProfileFollowersType, string>({
      query: username => `profiles/${username}/followers`,
      providesTags: (result, error, username) => [
        {type: 'Followers', id: username},
      ],
    }),
    getProfileFollowing: builder.query<ProfileFollowersType, string>({
      query: username => `profiles/${username}/following`,
      providesTags: (result, error, username) => [
        {type: 'Following', id: username},
      ],
    }),
  }),
});

export const {
  useGetProfileByUserNameQuery,
  useGetProfilePostsByUserNameQuery,
  useGetProfileFollowersQuery,
  useGetProfileFollowingQuery,
} = profileApi;
