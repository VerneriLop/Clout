import {CustomUser} from '../../../types/types';
import {apiSlice} from '../apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsersByIds: builder.query<CustomUser[], number[]>({
      query: userIds => ({
        url: '/users/',
        method: 'POST',
        body: {userIds},
      }),
      providesTags: ['Users'],
    }),
  }),
});

export const {useGetUsersByIdsQuery} = usersApi;
