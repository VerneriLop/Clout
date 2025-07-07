import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {FeedList} from '../../components/FeedList/FeedList';
import {
  ThemedIcon,
  Title1Text,
  Title3Text,
} from '../../components/ui/typography';
import {useGetFeedPostsInfiniteQuery} from '../../redux/api/endpoints/posts';

export const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Title1Text variant={'heavy'}> SEARCH</Title1Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
