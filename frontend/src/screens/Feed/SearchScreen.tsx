import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Search} from '../../components/Search/Search';
import {InfiniteUserList} from '../../components/UserList/InfiniteUserList';

export const SearchScreen = () => {
  const [value, setValue] = useState<string>('');
  const {
    data,
    refetch,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetSearchUsersQuery();

  return (
    <View style={styles.container}>
      <Search onModal={false} value={value} setValue={setValue} />
      <InfiniteUserList
        data={data}
        refetch={refetch}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
