import {CommentType} from '../../../types/types';
import {apiSlice} from '../apiSlice';

export const commentsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCommentsByImageId: builder.query<CommentType[], number>({
      query: imageId => `images/${imageId}/comments/`,
      providesTags: (result, error, imageId) => [
        {type: 'Comments', id: imageId},
      ],
    }),
    addComment: builder.mutation<
      CommentType,
      {image_id: number; comment: string}
    >({
      query: ({image_id, comment}) => ({
        url: `images/${image_id}/comments/`,
        method: 'POST',
        body: {comment},
      }),
      invalidatesTags: (result, error, {image_id}) => [
        {type: 'Comments', id: image_id},
      ],
    }),
    deleteComment: builder.mutation<void, {id: number; image_id: number}>({
      query: ({id, image_id}) => ({
        url: `images/${image_id}/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, {image_id}) => [
        {type: 'Comments', id: image_id},
      ],
    }),
  }),
});

export const {
  useGetCommentsByImageIdQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
