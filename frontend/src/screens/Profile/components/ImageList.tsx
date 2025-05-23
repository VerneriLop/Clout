import React from 'react';
import {FlatList, Pressable, StyleSheet} from 'react-native';

import {useNavigation, useTheme} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import FastImage, {FastImageProps} from 'react-native-fast-image';

import {scaleFontSize, verticalScale} from '../../../assets/styles/scaling';
import {Spinner} from '../../../components/Spinner/Spinner';
import {ThemedView} from '../../../components/ui/themed-view';
import {ThemedText} from '../../../components/ui/typography';
import {ProfileStackParamList, Routes} from '../../../navigation/Routes';
import {imageHeight, style} from '../style';
import {ProfileInfoCard} from './ProfileInfoCard';

import {PostType, ProfileType} from '../../../types/types';

const ITEM_HEIGHT = imageHeight;

type ImageListProps = {
  posts: PostType[];
  profileUser: ProfileType;
  isFetchingPosts: boolean;
  isLoadingPosts: boolean;
  isErrorPosts: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  handleEndReached: () => void;
};

export const ImageList = ({
  posts,
  profileUser,
  isFetchingPosts,
  isLoadingPosts,
  isErrorPosts,
  refreshing,
  onRefresh,
  handleEndReached,
}: ImageListProps): JSX.Element => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();

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
        <ThemedText style={placeholderStyle.container}>
          Error loading posts.
        </ThemedText>
      );
    }
    return <ListPlaceholder />;
  };

  return (
    <FlatList
      ListHeaderComponent={
        profileUser && <ProfileInfoCard profileUser={profileUser} />
      }
      ListEmptyComponent={renderListEmptyComponent()}
      getItemLayout={(_data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      numColumns={3}
      onEndReachedThreshold={0}
      onEndReached={() => handleEndReached()}
      ListFooterComponent={isFetchingPosts ? <Spinner size={'small'} /> : null}
      refreshing={refreshing}
      onRefresh={() => onRefresh()}
    />
  );
};

type ImageBoxProps = {
  image: PostType;
  onPress: () => void;
  imageStyle?: FastImageProps['style'];
};

const ImageListItem = ({
  image,
  onPress,
  imageStyle,
}: ImageBoxProps): JSX.Element => {
  const {colors} = useTheme();
  return (
    <>
      <Pressable
        style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
        onPress={onPress}>
        <FastImage
          source={{uri: image.image_url}}
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

/*
const ListFooter = ({numPosts}: {numPosts: number}): JSX.Element => (
  <View>
    <Text style={style.boxText}>{`${numPosts} images`}</Text>
  </View>
);
*/

export const ListPlaceholder = () => (
  <ThemedView style={placeholderStyle.container}>
    <ThemedText style={placeholderStyle.text}>No posts yet</ThemedText>
  </ThemedView>
);

const placeholderStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: verticalScale(100),
  },
  text: {
    fontSize: scaleFontSize(28),
    fontWeight: 'bold',
  },
  icon: {
    height: verticalScale(100),
    width: verticalScale(100),
    borderRadius: verticalScale(100),
    borderWidth: StyleSheet.hairlineWidth * 5,
    alignItems: 'center',
  },
});
