import React, {useEffect} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {FlatList} from 'react-native';
import {FeedPost} from './FeedPost';
import {mockImageList} from './mock';
import {useDispatch, useSelector} from 'react-redux';
import {setFeedImages} from '../../redux/slices/feedImageSlice';
import {RootState} from '../../redux/store/store';

export const FeedScreen = (): JSX.Element => {
  //TODO: Replace mockImageList with api answer.
  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend

  const dispatch = useDispatch();
  useEffect(() => {
    //apicall for feed images
    dispatch(setFeedImages(mockImageList));
  }, [dispatch]);

  const data = useSelector((state: RootState) => state.feedImage.feedImages);

  return (
    <ThemedSafeAreaView style={[globalStyle.flex]}>
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <FeedPost post={item} />}
        showsVerticalScrollIndicator={false}
      />
    </ThemedSafeAreaView>
  );
};
