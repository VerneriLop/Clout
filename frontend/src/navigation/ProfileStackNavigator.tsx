import React from 'react';
import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {FollowersScreen} from '../screens/Profile/FollowersScreen';
import {ImageDetailsScreen} from '../screens/Profile/ImageDetailsScreen';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {SettingsScreen} from '../screens/Settings/SettingsScreen';
import {ProfileStackParamList, Routes} from './Routes';

const ProfileStack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = () => {
  const loggedInUser = useSelector((state: RootState) => state.user);
  const theme = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{headerStyle: {backgroundColor: theme.colors.background}}}>
      <ProfileStack.Screen
        name={Routes.Profile}
        component={ProfileScreen}
        options={{headerTitleAlign: 'left', title: ''}}
        initialParams={{userId: loggedInUser.user?.id}}
      />
      <ProfileStack.Screen name={Routes.Settings} component={SettingsScreen} />
      <ProfileStack.Screen
        name={Routes.Followers}
        component={FollowersScreen}
      />
      <ProfileStack.Screen
        name={Routes.EditProfile}
        component={EditProfileScreen}
        options={{title: 'Edit profile'}}
      />
      <ProfileStack.Screen
        name={Routes.ImageDetail}
        component={ImageDetailsScreen}
        options={{title: 'Posts'}}
      />
    </ProfileStack.Navigator>
  );
};
