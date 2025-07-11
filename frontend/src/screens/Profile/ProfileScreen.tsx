import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {skipToken} from '@reduxjs/toolkit/query';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {Spinner} from '../../components/Spinner/Spinner';
import {TabBar} from '../../components/TabBar';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
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
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

  const {
    data: profileUser = null,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetProfileByUserNameQuery(username ? username : skipToken);

  const allPosts = React.useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

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

  console.log('profileuseri:', profileUser);

  const renderHeader = () => {
    return <ProfileInfoCard profileUser={profileUser} />;
  };

  const renderPosts = () => (
    <ImageList
      onScroll={scrollHandler}
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

  const renderStats = () => (
    <View
      style={{
        width: '100%',
        flex: 1,
        backgroundColor: 'rgb(206, 172, 214)',
      }}
    />
  );

  //

  return (
    <TabBar
      renderHeader={renderHeader}
      renderPosts={renderPosts}
      renderStats={renderStats}
      scrollY={scrollY}
    />
  );
};

const AnimatedTabBar = Animated.createAnimatedComponent(TabBar);
const AnimatedImageList = Animated.createAnimatedComponent(ImageList);

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
