import {apiSlice} from '../apiSlice';

import {LikeType, PostType} from '../../../types/types';

export const postsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFeedPosts: builder.query<PostType[], void>({
      query: () => 'posts/',
      providesTags: () => [{type: 'Posts'}],
    }),

    likeImage: builder.mutation<LikeType, number>({
      query: image_id => ({
        url: `images/${image_id}/likes/`,
        method: 'POST',
        body: {image_id},
      }),
      invalidatesTags: (result, error, image_id) => [
        {type: 'Likes', id: image_id},
      ],
    }),
    unLikeImage: builder.mutation<void, LikeType>({
      query: ({id, image_id}) => ({
        url: `images/${image_id}/likes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, {image_id}) => [
        {type: 'Likes', id: image_id},
      ],
    }),
  }),
});

export const {
  useGetFeedPostsQuery,
  useLikeImageMutation,
  useUnLikeImageMutation,
} = postsApi;
