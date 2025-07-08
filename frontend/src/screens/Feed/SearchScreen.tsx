import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Search} from '../../components/Search/Search';
import {InfiniteUserList} from '../../components/UserList/InfiniteUserList';
import {useSearchUsersInfiniteQuery} from '../../redux/api/endpoints/users';

export const SearchScreen = () => {
  const [value, setValue] = useState<string>('');
  const {
    data,
    refetch,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchUsersInfiniteQuery(value);

  const userList = useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  console.log('queryn data', data);
  console.log('value', value);
  console.log('Data', userList);

  return (
    <View style={styles.container}>
      <Search onModal={false} value={value} setValue={setValue} />
      <InfiniteUserList
        data={userList}
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
