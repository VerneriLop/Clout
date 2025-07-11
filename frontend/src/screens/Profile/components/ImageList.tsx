import React from 'react';
import {
  Dimensions,
  Image,
  ImageProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import {useNavigation, useTheme} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FlashList} from '@shopify/flash-list';
import {Tabs} from 'react-native-collapsible-tab-view';
import Animated, {ScrollHandler} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Spinner} from '../../../components/Spinner/Spinner';
import {TabBar} from '../../../components/TabBar';
import {ThemedView} from '../../../components/ui/themed-view';
import {ThemedText, Title1Text} from '../../../components/ui/typography';
import {ProfileStackParamList, Routes} from '../../../navigation/Routes';
import {ProfileInfoCard} from './ProfileInfoCard';

import {PostType, ProfileType} from '../../../types/types';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<PostType>);

type ImageListProps = {
  posts: PostType[];
  profileUser: ProfileType;
  isFetchingPosts: boolean;
  isLoadingPosts: boolean;
  isErrorPosts: boolean;
  refreshing: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  handleEndReached: () => void;
  onScroll?: ScrollHandler;
};

const {width} = Dimensions.get('window');
export const imageWidth = Math.ceil(width / 3);
export const imageHeight = imageWidth * (4 / 3);

export const ImageList = ({
  posts,
  profileUser,
  isFetchingPosts,
  isLoadingPosts,
  isErrorPosts,
  refreshing,
  hasNextPage,
  onRefresh,
  handleEndReached,
  onScroll,
}: ImageListProps) => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const handlePress = (item: PostType) => {
    navigation.navigate(Routes.ProfileFeed, {
      imageId: item.id,
      username: profileUser.username,
    });
  };

  const renderItem = ({item}: {item: PostType}) => {
    return <ImageListItem image={item} onPress={() => handlePress(item)} />;
  };

  const renderListEmptyComponent = () => {
    if (isLoadingPosts) {
      return <Spinner size={'small'} />;
    }
    if (isErrorPosts) {
      return (
        <ThemedText style={style.container}>Error loading posts.</ThemedText>
      );
    }
    return <ListPlaceholder />;
  };

  const itemSize = imageHeight + StyleSheet.hairlineWidth * 2;

  return (
    <Tabs.FlashList
      //contentInsetAdjustmentBehavior="automatic"
      /*ListHeaderComponent={() => (
        <>
          <View
            style={{
              flex: 1,
              height: layout.height / 2 - insets.top - insets.bottom,
              backgroundColor: '',
              pointerEvents: 'box-none',
            }}
          />
        </>
      )}*/
      scrollEventThrottle={16}
      //onScroll={onScroll}
      nestedScrollEnabled
      ListEmptyComponent={renderListEmptyComponent}
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      numColumns={3}
      onEndReachedThreshold={0.3}
      onEndReached={hasNextPage ? () => handleEndReached() : null}
      ListFooterComponent={isFetchingPosts ? <Spinner size={'small'} /> : null}
      //refreshing={refreshing}
      //onRefresh={onRefresh}
      estimatedItemSize={itemSize}
      key={refreshing ? 'refreshing' : 'stable'}
      //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={}/>}
    />
  );
};

type ImageBoxProps = {
  image: PostType;
  onPress: () => void;
  imageStyle?: ImageProps['style'];
};

const ImageListItem = ({image, onPress, imageStyle}: ImageBoxProps) => {
  const {colors} = useTheme();
  return (
    <>
      <Pressable
        style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
        onPress={onPress}>
        <Image
          source={{
            uri: image.thumbnail_url ? image.thumbnail_url : image.image_url,
          }}
          resizeMode="cover"
          style={[
            imageStyle ? imageStyle : style.imageBox,
            {borderColor: colors.border},
          ]}
        />
      </Pressable>
    </>
  );
};

export const ListPlaceholder = () => (
  <ThemedView style={style.container}>
    <Title1Text variant="heavy">No posts yet</Title1Text>
  </ThemedView>
);

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 100,
  },
  icon: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth * 5,
    alignItems: 'center',
  },
  imageBox: {
    width: imageWidth,
    height: imageHeight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'white',
  },
});
