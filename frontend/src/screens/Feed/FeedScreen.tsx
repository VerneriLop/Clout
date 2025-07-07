import React, {useMemo} from 'react';

import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {FeedList} from '../../components/FeedList/FeedList';
import {ThemedIcon} from '../../components/ui/typography';
import {useGetFeedPostsInfiniteQuery} from '../../redux/api/endpoints/posts';

export const FeedScreen = () => {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetFeedPostsInfiniteQuery();

  const feedPosts = useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  return (
    <FeedList
      posts={feedPosts}
      handleEndReached={fetchNextPage}
      isFetchingPosts={isFetchingNextPage}
      refreshing={isLoading}
      hasNextPage={hasNextPage}
      onRefresh={refetch}
    />
  );
};
