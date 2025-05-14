import {apiSlice} from '../apiSlice';

import {CustomUser} from '../../../types/types';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsersByIds: builder.query<CustomUser[], number[]>({
      query: userIds => ({
        url: '/users/',
        method: 'GET',
        body: {userIds},
      }),
      providesTags: ['Users'],
    }),
  }),
});

export const {useGetUsersByIdsQuery} = usersApi;
