import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {faChevronRight, faSearch} from '@fortawesome/free-solid-svg-icons';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation, useRoute} from '@react-navigation/native';
import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import globalStyle from '../../assets/styles/globalStyle';
import {Backdrop} from '../../components/Backdrop/Backdrop';
import {UserList} from '../../components/UserList/UserList';
import {ThemedSafeAreaView, ThemedView} from '../../components/ui/themed-view';
import {useSelectedFeedPost} from '../../hooks/useSelectedFeedPost';
import {useTheme} from '../../hooks/useTheme';
import {Routes} from '../../navigation/Routes';
import {
  useGetLikesQuery,
  useGetPostCommentsInfiniteQuery,
} from '../../redux/api/endpoints/posts';
import {OpacityPressable} from '../OpacityPressable/OpacityPressable';
import {Spinner} from '../Spinner/Spinner';
import {
  BodyText,
  ThemedIcon,
  Title1Text,
  Title2Text,
  Title3Text,
} from '../ui/typography';
import {CommentModal} from './CommentModal';
import {FeedPost, IMAGE_HEIGHT} from './FeedPost';

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

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

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
  const [modalToRender, setModalToRender] = useState<
    'likes' | 'comments' | null
  >(null);
  const likeSheetRef = useRef<BottomSheetModal>(null);
  const commentSheetRef = useRef<BottomSheetModal | null>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute();

  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend

  const shouldRenderLikesModal = modalToRender === 'likes';
  const shouldRenderCommentsModal = modalToRender === 'comments';

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
    likeSheetRef.current?.present();
  };

  const handleShowComments = (post: PostType) => {
    setSelectedPost(post);
    setModalToRender('comments');
    commentSheetRef.current?.present();
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

  console.log('feedlistan selected post', selectedPost);

  const itemSize = 60 + IMAGE_HEIGHT + 100; //topbar + image + bottombar

  const ThemeViewComponent =
    route.name === Routes.ProfileFeed ? ThemedView : ThemedSafeAreaView;

  const EmptyList = () => {
    return (
      <ThemedView style={style.emptyList}>
        <Title1Text variant="heavy">No posts available</Title1Text>
      </ThemedView>
    );
  };

  const translationY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler(event => {
    if (event.contentOffset.y > HEADER_HEIGHT / 2) {
      translationY.value = -HEADER_HEIGHT;
      opacity.value = 0;
    } else {
      translationY.value = 0;
      opacity.value = 1;
    }
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: withTiming(translationY.value, {duration: 200})},
      ],
      opacity: withTiming(opacity.value, {duration: 200}),
    };
  });

  return (
    <ThemeViewComponent style={[globalStyle.flex]}>
      <Animated.View
        pointerEvents={'box-none'}
        style={[style.header, {top: insets.top}, headerAnimatedStyle]}>
        {/*<Title1Text variant="heavy">Posts</Title1Text>*/}
        <Header color={colors.primary} />
      </Animated.View>
      <AnimatedFlashList
        onScroll={scrollHandler}
        contentContainerStyle={{paddingTop: HEADER_HEIGHT}}
        contentInsetAdjustmentBehavior="automatic"
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
        estimatedItemSize={itemSize}
        onRefresh={() => onRefresh()}
        key={refreshing ? 'refreshing' : 'stable'}
        estimatedFirstItemOffset={0}
        ListEmptyComponent={!refreshing ? EmptyList() : null}
      />

      <BottomSheetModal
        ref={likeSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={() => setSelectedPost(null)}
        index={1}
        backgroundStyle={{backgroundColor: colors.card}}
        handleIndicatorStyle={{backgroundColor: colors.border}}
        topInset={insets.top}
        backdropComponent={Backdrop}>
        <UserList
          data={likedUsers}
          onItemPress={() => likeSheetRef.current?.dismiss()}
          onModal
          onRefresh={refetchLikes}
          isFetchingData={isLoadingLikes}
        />
      </BottomSheetModal>

      <CommentModal
        commentSheetRef={commentSheetRef}
        snapPoints={snapPoints}
        onDismiss={() => setSelectedPost(null)}
        //selectedPost={selectedPost || ({} as PostType)}
        index={1}
      />
    </ThemeViewComponent>
  );
};

const Header = ({color}: {color: string | undefined}) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate(Routes.Search);
    console.log('search');
  };
  return (
    //<View style={style.header}>
    <OpacityPressable style={style.headerButton} onPress={handlePress}>
      <ThemedIcon color={color} icon={faSearch} size={15} />
      <BodyText style={{color: color}}>Search users</BodyText>
    </OpacityPressable>
    //</View>
  );
};

const HEADER_HEIGHT = 40;

const style = StyleSheet.create({
  headerButton: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  emptyList: {
    alignItems: 'center',
    flex: 1,
    marginTop: 150,
  },
  header: {
    //flex: 1,
    position: 'absolute',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    //justifyContent: 'space-between',
    justifyContent: 'center',
    width: '100%',
    height: HEADER_HEIGHT,
    //paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    //borderBottomWidth: StyleSheet.hairlineWidth,
    //borderBottomColor: 'gray',
  },
});
