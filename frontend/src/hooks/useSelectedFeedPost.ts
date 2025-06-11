// useProfilePosts.ts
import {useState} from 'react';

import {PostType} from '../types/types';

export const useSelectedFeedPost = () => {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  return {
    selectedPost,
    setSelectedPost,
  };
};
