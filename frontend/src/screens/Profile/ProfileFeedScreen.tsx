import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {ProfileStackParamList} from '../../navigation/Routes';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ThemedView} from '../../components/ui/themed-view';
import {CustomImage, mockImageList} from '../Feed/mock';
import {FeedPost} from '../Feed/FeedPost';
import globalStyle from '../../assets/styles/globalStyle';

type ImageDetailsProps = NativeStackScreenProps<
  ProfileStackParamList,
  'ImageDetail'
>;

export const ProfileFeedScreen = ({route}: ImageDetailsProps): JSX.Element => {
  const {imageId, userId} = route.params;
  const [imageData, setImageData] = useState<CustomImage[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList<CustomImage>>(null);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getImagesByUser(userId);
        setImageData(images);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [userId]);

  useEffect(() => {
    if (!loading && imageData.length > 0) {
      const index = imageData.findIndex(img => img.id === imageId);
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }, 50);
      }
    }
  }, [loading, imageData, imageId]);

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

  if (loading) {
    return <ActivityIndicator style={styles.activityIndicator} size="large" />;
  }
  console.log(
    imageData.findIndex(img => img.id === imageId),
    imageData.length,
  );
  return (
    <ThemedView style={[globalStyle.flex]}>
      <FlatList
        ref={flatListRef}
        data={imageData}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <FeedPost post={item} />}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={handleScrollToFailed}
      />
    </ThemedView>
  );
};

const getImagesByUser = async (id: number) => {
  return mockImageList.filter(img => img.user.id === id);
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});
