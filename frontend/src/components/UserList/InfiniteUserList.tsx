import {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';

import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';

import {
  useCreateFollowMutation,
  useDeleteFollowMutation,
} from '../../redux/api/endpoints/users';
import {RootState} from '../../redux/store/store';
import {Spinner} from '../Spinner/Spinner';
import {ThemedText} from '../ui/typography';
import {UserListItem} from './UserListItem';

import {LikeOwner, ProfileFollowerType} from '../../types/types';

type InfiniteUserListProps = {
  data: LikeOwner[] | ProfileFollowerType[];
  refetch: () => void;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export const InfiniteUserList = ({
  data,
  refetch,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteUserListProps) => {
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  const [followUser, {isLoading: isFollowingUser}] = useCreateFollowMutation();
  const [unfollowUser, {isLoading: isUnfollowingUser}] =
    useDeleteFollowMutation();
  const currentUsername = useSelector(
    (state: RootState) => state.auth.username,
  );

  const isMutationLoading = isFollowingUser || isUnfollowingUser;

  const handleFollowToggle = useCallback(
    async (user_id: string, currentlyFollowing: boolean) => {
      if (isMutationLoading) {
        return;
      }
      const mutationPayload = {
        user_id,
        username: currentUsername ?? '', //invalidatetag
      };
      setTogglingUserId(user_id);

      try {
        if (currentlyFollowing) {
          await unfollowUser(mutationPayload).unwrap();
        } else {
          await followUser(mutationPayload).unwrap();
        }
      } catch (error) {
        console.error('Failed to toggle follow state:', error);
      } finally {
        setTogglingUserId(null);
      }
    },
    [followUser, unfollowUser, isMutationLoading, currentUsername],
  );

  const renderItem = useCallback(
    ({item}: {item: ProfileFollowerType}) => {
      const isFollowed = item.is_followed_by_current_user;
      const isLoadingThisItem = isMutationLoading && togglingUserId === item.id;

      return (
        <UserListItem
          user={item}
          isFollowedByLoggedInUser={isFollowed}
          onFollowToggle={handleFollowToggle}
          isLoadingToggle={isLoadingThisItem}
        />
      );
    },
    [handleFollowToggle, isMutationLoading, togglingUserId],
  );

  return (
    <FlashList
      ListEmptyComponent={
        !isLoading ? (
          <ThemedText style={styles.listEmptyText}>No users found</ThemedText>
        ) : null
      }
      data={data ?? []}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      keyboardDismissMode="on-drag"
      ListFooterComponent={
        isFetchingNextPage ? <Spinner size={'small'} /> : null
      }
      onEndReached={hasNextPage ? () => fetchNextPage() : null}
      onEndReachedThreshold={0.2}
      refreshing={isLoading}
      onRefresh={() => refetch()}
    />
  );
};

const styles = StyleSheet.create({
  listEmptyText: {
    fontSize: 17,
    fontWeight: '900',
    color: 'gray',
    paddingHorizontal: 16,
  },
});
