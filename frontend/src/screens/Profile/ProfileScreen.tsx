import React from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import globalStyle from '../../assets/styles/globalStyle';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {useProfilePosts} from '../../hooks/useProfilePosts';
import {ProfileStackParamList} from '../../navigation/Routes';
import {useGetProfileByUserNameQuery} from '../../redux/api/endpoints/profiles';
import {ImageList} from './components/ImageList';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = ({route}: ProfileProps): JSX.Element => {
  const {username} = route.params;

  const {
    posts,
    onRefresh,
    isFetching: isPostsFetching,
    handleEndReached,
    isError: isPostsError,
    error: postsError,
    refreshing,
    isLoading: isPostsLoading,
  } = useProfilePosts(username);

  console.log({isPostsLoading, postsLength: posts.length});

  const {
    data: profileUser = null,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetProfileByUserNameQuery(username);

  if (isUserLoading) {
    return <Spinner />;
  }

  if (!profileUser || isUserError) {
    console.error('Error fetching data:', userError);
    return (
      <ThemedView>
        <ThemedText>Error getting profile</ThemedText>
      </ThemedView>
    );
  }

  if (isPostsError) {
    console.error('Error fetching posts:', postsError);
  }

  return (
    <ThemedView style={[globalStyle.flex]}>
      <ImageList
        posts={posts}
        profileUser={profileUser}
        isFetchingPosts={isPostsFetching}
        isLoadingPosts={isPostsLoading}
        isErrorPosts={isPostsError}
        refreshing={refreshing}
        onRefresh={onRefresh}
        handleEndReached={handleEndReached}
      />
    </ThemedView>
  );
};
