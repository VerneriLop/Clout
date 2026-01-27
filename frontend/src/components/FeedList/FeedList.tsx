import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';

import {useRoute} from '@react-navigation/native';
import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';

import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView, ThemedView} from '../../components/ui/themed-view';
import {useSelectedFeedPost} from '../../hooks/useSelectedFeedPost';
import {Routes} from '../../navigation/Routes';
import {useGetLikesQuery} from '../../redux/api/endpoints/posts';
import {Spinner} from '../Spinner/Spinner';
import {Title1Text} from '../ui/typography';
import {CommentModal} from './CommentModal';
import {FeedPost} from './FeedPost';
import {LikeModal} from './LikeModal';

import {PostType} from '../../types/types';

type FeedListProps = {
  posts: PostType[];
  initalScrollIndex?: number | null;
  handleEndReached: () => void;
  isFetchingPosts: boolean;
  refreshing: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
};

export const FeedList = ({
  posts,
  initalScrollIndex,
  handleEndReached,
  isFetchingPosts,
  refreshing,
  hasNextPage,
  onRefresh,
}: FeedListProps) => {
  const {selectedPost, setSelectedPost} = useSelectedFeedPost(); //useState<PostType | null>(null);
  const [modalToRender, setModalToRender] = useState<'likes' | null>(null);
  const [commentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [likeModalVisible, setLikeModalVisible] = useState<boolean>(false);
  const route = useRoute();

  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend

  const shouldRenderLikesModal = modalToRender === 'likes';

  const {
    data: likes = {data: [], count: 0},
    isFetching,
    isLoading: isLoadingLikes,
    refetch: refetchLikes,
  } = useGetLikesQuery(
    selectedPost && shouldRenderLikesModal
      ? {post_id: selectedPost.id}
      : skipToken,
  );

  const likedUsers =
    selectedPost && likes.data && !isFetching
      ? likes.data.map(like => like.owner)
      : [];

  const handleShowLikes = (post: PostType) => {
    setSelectedPost(post);
    setModalToRender('likes');
    setLikeModalVisible(true);
  };

  const handleShowComments = (post: PostType) => {
    setSelectedPost(post);
    setModalToRender(null);
    setCommentModalVisible(true);
  };

  const renderItem = useCallback(
    ({item}: {item: PostType}) => (
      <FeedPost
        post={item}
        onShowLikes={handleShowLikes}
        onShowComments={handleShowComments}
      />
    ),
    [],
  );

  const ThemeViewComponent =
    route.name === Routes.ProfileFeed ? ThemedView : ThemedSafeAreaView;

  const EmptyList = () => {
    return (
      <ThemedView style={style.emptyList}>
        <Title1Text variant="heavy">No posts available</Title1Text>
      </ThemedView>
    );
  };

  return (
    <ThemeViewComponent style={[globalStyle.flex]}>
      <FlashList
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={initalScrollIndex || null}
        onEndReachedThreshold={0.2}
        onEndReached={hasNextPage ? () => handleEndReached() : null}
        ListFooterComponent={
          isFetchingPosts ? <Spinner size={'small'} /> : null
        }
        refreshing={refreshing}
        onRefresh={() => onRefresh()}
        key={refreshing ? 'refreshing' : 'stable'}
        ListEmptyComponent={!refreshing ? EmptyList() : null}
      />

      <LikeModal
        likeModalVisible={likeModalVisible}
        setLikeModalVisible={setLikeModalVisible}
        likedUsers={likedUsers}
        refetchLikes={refetchLikes}
        isLoadingLikes={isLoadingLikes}
      />

      <CommentModal
        commentModalVisible={commentModalVisible}
        setCommentModalVisible={setCommentModalVisible}
      />
    </ThemeViewComponent>
  );
};

const style = StyleSheet.create({
  emptyList: {
    alignItems: 'center',
    flex: 1,
    marginTop: 150,
  },
});
