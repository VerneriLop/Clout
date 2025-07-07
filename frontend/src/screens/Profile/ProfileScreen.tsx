import React, {useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {skipToken} from '@reduxjs/toolkit/query';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import globalStyle from '../../assets/styles/globalStyle';
import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedView} from '../../components/ui/themed-view';
import {BodyText, ThemedText} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {ProfileStackParamList} from '../../navigation/Routes';
import {
  useGetProfileByUserNameQuery,
  useGetProfilePostsInfiniteQuery,
} from '../../redux/api/endpoints/profiles';
import {useGetUsersMeQuery} from '../../redux/api/endpoints/users';
import {ImageList} from './components/ImageList';
import {ProfileInfoCard} from './components/ProfileInfoCard';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = ({route, navigation}: ProfileProps) => {
  const {colors} = useTheme();
  const {
    data: loggedInUser,
    isError,
    isLoading: isLoadingMe,
  } = useGetUsersMeQuery(undefined, {skip: !!route.params});

  const username = route.params?.username
    ? route.params.username
    : loggedInUser?.username;

  useEffect(() => {
    if (loggedInUser) {
      navigation.setOptions({
        title: route.params?.username || loggedInUser.username,
      });
    }
  }, [loggedInUser]);

  const {
    data, // Contains { pages: PostTypeWithCount[], pageParams: ProfilePostsPageParam[] }
    //isFetching,
    isLoading,
    isError: isPostsError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetProfilePostsInfiniteQuery(username ? username : skipToken);

  const allPosts = React.useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  const {
    data: profileUser = null,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetProfileByUserNameQuery(username ? username : skipToken);

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
    console.error('Error fetching posts:', error);
  }

  return (
    <ImageList
      posts={allPosts}
      profileUser={profileUser}
      isFetchingPosts={isFetchingNextPage}
      isLoadingPosts={isLoading}
      isErrorPosts={isPostsError}
      refreshing={isLoading}
      onRefresh={refetch}
      hasNextPage={hasNextPage}
      handleEndReached={fetchNextPage}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    //justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    //borderBottomColor: '#ddd',
    position: 'relative',
    //backgroundColor: 'blue',
  },
  tab: {flex: 1, paddingVertical: 10, alignItems: 'center'},
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '50%',
    //backgroundColor: 'white',
  },
});
