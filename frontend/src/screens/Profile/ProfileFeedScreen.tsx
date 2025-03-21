import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ProfileStackParamList} from '../../navigation/Routes';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ThemedView} from '../../components/ui/themed-view';
import {CustomImage, mockImageList} from '../Feed/mock';
import {FeedPost} from '../Feed/FeedPost';
import globalStyle from '../../assets/styles/globalStyle';
import {useSelector} from 'react-redux';
import {
  selectAllPosts,
  selectPostIndexById,
  selectPostsIndex,
  selectPostsStatus,
} from '../../redux/slices/profilePostsSlice';
import store, {RootState} from '../../redux/store/store';
import Animated from 'react-native-reanimated';
import {verticalScale} from '../../assets/styles/scaling';

type ImageDetailsProps = NativeStackScreenProps<
  ProfileStackParamList,
  'ImageDetail'
>;

export const ProfileFeedScreen = ({route}: ImageDetailsProps): JSX.Element => {
  const {imageId} = route.params || {};
  const postIndex = useMemo(() => {
    return imageId ? selectPostIndexById(store.getState(), imageId) : 0;
  }, [imageId]);
  //const {imageId} = route.params;
  const imageData = useSelector(selectAllPosts);
  const postStatus = useSelector(selectPostsStatus);
  //const postIndex = useSelector((state: RootState) =>
  //  selectPostIndexById(state, imageId),
  //);

  console.log(postIndex);
  console.log(postStatus);
  //const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList<CustomImage>>(null);
  console.log('render profilefeedscreen');

  /*useEffect(() => {
    if (imageData.length > 0) {
      if (postIndex !== null) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: postIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 20);
      }
    }
  }, [imageData, postIndex]);

  const handleScrollToFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
  }) => {
    console.warn(
      'Scroll to index failed, scrolling to the closest possible index.',
    );
    console.warn(flatListRef);
    flatListRef.current?.scrollToIndex({
      index: Math.max(0, Math.min(info.highestMeasuredFrameIndex, info.index)),
      animated: true,
    });
  };
  */
  //https://reactnative.dev/docs/optimizing-flatlist-configuration
  const renderItem = useCallback(
    ({item}: {item: CustomImage}) => <FeedPost post={item} />,
    [],
  );

  if (!imageData) {
    console.log('lol');
    return <ActivityIndicator style={styles.activityIndicator} size="large" />;
  }

  return (
    <Animated.View style={[{flex: 1}]} sharedTransitionTag="Profile">
      <ThemedView style={[globalStyle.flex]}>
        <FlatList
          ref={flatListRef}
          data={imageData}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={postIndex}
        />
      </ThemedView>
    </Animated.View>
  );
};

const getImagesByUser = async (id: number) => {
  return mockImageList.filter(img => img.user.id === id);
};

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width;
const IMAGE_HEIGHT = (IMAGE_WIDTH / 3) * 4;

const TOP_BAR_HEIGHT = verticalScale(50);
const BOTTOM_BAR_HEIGHT = verticalScale(69);

const ITEM_HEIGHT = IMAGE_HEIGHT + TOP_BAR_HEIGHT + BOTTOM_BAR_HEIGHT;
const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});
