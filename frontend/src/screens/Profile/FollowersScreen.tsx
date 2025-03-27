import {StyleSheet, useWindowDimensions} from 'react-native';
import React, {memo} from 'react';
import {CustomUser} from '../Vote/mock';
import {useTheme} from '@react-navigation/native';
import {TabView, TabBar} from 'react-native-tab-view';
import {
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
} from '../../redux/slices/apiSlice';
import {ProfileStackParamList} from '../../navigation/Routes';
import {StackScreenProps} from '@react-navigation/stack';
import {UserList} from '../../components/UserList/UserList';

type FollowersScreenProps = StackScreenProps<
  ProfileStackParamList,
  'Followers'
>;

const routes = [
  {key: 'followers', title: 'Followers'},
  {key: 'following', title: 'Following'},
];

export const FollowersScreen = ({
  route: mainRoute,
}: FollowersScreenProps): JSX.Element => {
  const {userId} = mainRoute.params;
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const {colors} = useTheme();

  const {data: following = []} = useGetUserFollowingQuery(userId);

  const {data: followers = []} = useGetUserFollowersQuery(userId);

  const renderScene = ({
    route,
  }: {
    route: {
      key: string;
      title: string;
    };
  }) => {
    switch (route.key) {
      case 'followers':
        return <FollowersList data={followers} />;
      case 'following':
        return <FollowingList data={following} />;
      default:
        return null;
    }
  };
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primary}}
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }}
      activeColor={colors.text}
      inactiveColor={'gray'}
      android_ripple={{radius: 0}}
    />
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
};

export const FollowingList = memo(
  ({data}: {data: CustomUser[]}): JSX.Element => {
    return <UserList data={data} />;
  },
);

export const FollowersList = memo(
  ({data}: {data: CustomUser[]}): JSX.Element => {
    return <UserList data={data} />;
  },
);

/*
const renderScene = SceneMap({
  followers: FollowersList,
  following: FollowingList,
});
*/
