import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
//import {CustomImage} from '../../services/image/images';
import {
  mockImageList,
  mockUserList,
  CustomImage,
} from '../../screens/Feed/mock';
import {CustomUser} from '../../screens/Vote/mock';

const getImagesByUser = async (id: number) => {
  return mockImageList.filter(img => img.user.id === id);
};

const getUserById = async (id: number) => {
  return mockUserList.find(user => user.id === id);
};

export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // Replace with our actual abse url
  baseQuery: fetchBaseQuery({baseUrl: '/fakeApi'}),
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data.
    // The return value is a `Post[]` array, and it takes no arguments.
    getPosts: builder.query<CustomImage[], number>({
      queryFn: async (userId: number) => {
        // Use the mock function instead of making a real API call
        const posts = await getImagesByUser(userId);
        return {data: posts}; // Must return data in this format
      },
    }),
    getUserById: builder.query<CustomUser | undefined, number>({
      queryFn: async (userId: number) => {
        // Use the mock function instead of making a real API call
        const user = await getUserById(userId);
        return {data: user}; // Must return data in this format
      },
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {useGetPostsQuery, useGetUserByIdQuery} = apiSlice;
