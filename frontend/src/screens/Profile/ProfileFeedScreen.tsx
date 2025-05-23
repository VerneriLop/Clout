import React, {useEffect, useState} from 'react';

import {StackScreenProps} from '@react-navigation/stack';

import {FeedList} from '../../components/FeedList/FeedList';
import {useProfilePosts} from '../../hooks/useProfilePosts';
import {ProfileStackParamList} from '../../navigation/Routes';

type ImageDetailsProps = StackScreenProps<ProfileStackParamList, 'ProfileFeed'>;

export const ProfileFeedScreen = ({route}: ImageDetailsProps): JSX.Element => {
  const {imageId, username} = route.params || {};
  const [postIndex, setPostIndex] = useState<number | null>(null);
  const {
    posts,
    onRefresh,
    isFetching,
    refreshing,
    handleEndReached,
    isLoading,
  } = useProfilePosts(username);

  useEffect(() => {
    if (imageId && posts.length > 0) {
      const index = posts.findIndex(post => post.id === imageId);
      if (index !== -1) {
        setPostIndex(index);
      }
    }
  }, [imageId, posts]);

  const onRefreshPosts = () => {
    setPostIndex(0);
    onRefresh();
  };

  if (isLoading || (postIndex === null && imageId)) {
    return <></>;
  }

  return (
    <FeedList
      posts={posts}
      initalScrollIndex={postIndex}
      isFetchingPosts={isFetching}
      refreshing={refreshing}
      onRefresh={onRefreshPosts}
      handleEndReached={handleEndReached}
    />
  );
};
