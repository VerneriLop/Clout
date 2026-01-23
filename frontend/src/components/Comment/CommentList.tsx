import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {skipToken} from '@reduxjs/toolkit/query/react';
import {FlashList} from '@shopify/flash-list';

import {useSelectedFeedPost} from '../../hooks/useSelectedFeedPost';
import {useTheme} from '../../hooks/useTheme';
import {useGetPostCommentsInfiniteQuery} from '../../redux/api/endpoints/posts';
import {Spinner} from '../Spinner/Spinner';
import {ThemedText} from '../ui/typography';
import {CommentListItem} from './CommentListItem';

import {CommentType} from '../../types/types';

type CommentListType = {
  onItemPress?: () => void;
  editingCommentId?: string | null;
  onStartEdit?: (id: string) => void;
  onStopEdit?: () => void;
  editingActive?: boolean;
};

export const CommentList = ({
  onItemPress,
  editingCommentId,
  onStartEdit,
  onStopEdit,
  editingActive,
}: CommentListType) => {
  const {selectedPost} = useSelectedFeedPost();
  const {colors} = useTheme();

  const {
    data: comments,
    isFetching: isFetchingComments,
    isLoading: isLoadingComments,
    isError: isPostsError,
    hasNextPage: hasNextCommentPage,
    fetchNextPage: fetchNextCommentPage,
    isFetchingNextPage: isFetchingNextCommentPage,
    refetch: refetchComments,
  } = useGetPostCommentsInfiniteQuery(
    selectedPost ? selectedPost.id : skipToken,
  );

  const data = React.useMemo(
    () => comments?.pages?.flatMap(page => page.data) || [],
    [comments],
  );

  const renderItem = useCallback(
    ({item}: {item: CommentType}) => (
      <CommentListItem
        comment={item}
        onItemPress={onItemPress}
        commentIsUnderEditing={editingCommentId === item.id}
        onStartEdit={() => onStartEdit?.(item.id)}
        onStopEdit={onStopEdit}
        blurred={!!editingCommentId && editingCommentId !== item.id}
        editingActive={editingActive}
      />
    ),
    [onItemPress, editingCommentId, onStartEdit, onStopEdit, editingActive],
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.card}]}>
      <FlashList
        ListEmptyComponent={
          data.length === 0 ? (
            <Spinner size={'small'} style={styles.spinnerPadding} />
          ) : (
            <View style={styles.noComments}>
              <ThemedText style={styles.listEmptyText}>
                No comments found
              </ThemedText>
            </View>
          )
        }
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        onEndReached={
          hasNextCommentPage ? () => fetchNextCommentPage() : undefined
        }
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  listEmptyText: {
    fontSize: 17,
    fontWeight: '900',
    color: 'gray',
    paddingHorizontal: 16,
  },
  noComments: {
    alignItems: 'center',
    paddingTop: 40,
  },
  spinnerPadding: {
    padding: 10,
  },
});
