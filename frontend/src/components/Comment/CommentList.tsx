import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {verticalScale} from '../../assets/styles/scaling';
import {ThemedText} from '../ui/typography';
import {CommentType} from '../../types/types';
import {CommentListItem} from './CommentListItem';

type CommentListType = {
  data: CommentType[];
  onItemPress?: () => void;
};

// todo: add options for size and searchbarvisible
export const CommentList = ({
  data,
  onItemPress,
}: CommentListType): JSX.Element => {
  const renderItem = useCallback(
    ({item}: {item: CommentType}) => (
      <CommentListItem comment={item} onItemPress={onItemPress} />
    ),
    [onItemPress],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={
          <ThemedText style={styles.listEmptyText}>
            No comments found
          </ThemedText>
        }
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};

//TODO: check this value
const ITEM_HEIGHT = verticalScale(50);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  listEmptyText: {
    fontSize: 17,
    fontWeight: '900',
    color: 'gray',
    paddingHorizontal: 16,
  },
});
