import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {faBars, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {OpacityPressable} from '../components/OpacityPressable/OpacityPressable';
import {useTheme} from '../hooks/useTheme';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {FollowersScreen} from '../screens/Profile/FollowersScreen';
import {ProfileFeedScreen} from '../screens/Profile/ProfileFeedScreen';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {ProfileStackParamList, Routes} from './Routes';
import {SettingsStackNavigator} from './SettingsStackNavigator';

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = () => {
  const theme = useTheme();
  const renderSettingsButton = useCallback(() => <SettingsButton />, []);
  const renderBackButton = useCallback(() => <BackButton />, []);
  return (
    <ProfileStack.Navigator
      screenOptions={({theme}) => ({
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerTitleAlign: 'left',
      })}>
      <ProfileStack.Screen
        name={Routes.Profile}
        component={ProfileScreen}
        options={({route}) => ({
          headerRight: route.params?.username
            ? undefined
            : renderSettingsButton,
          title: route.params?.username || '',
          headerLeft: route.params?.username ? renderBackButton : undefined,
          //headerTitleStyle: {
          //  fontSize: 20,
          //  lineHeight: 25,
          //},
          //headerStyle: {justifyContent: 'center'},
          headerLargeTitle: true,

          //headerStyle: {backgroundColor: 'transparent'},
        })}
      />
      <ProfileStack.Screen
        name={Routes.SettingsStack}
        component={SettingsStackNavigator}
        options={{headerShown: false}}
      />
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
        name={Routes.ProfileFeed}
        component={ProfileFeedScreen}
        options={{title: 'Posts'}}
      />
    </ProfileStack.Navigator>
  );
};

export const SettingsButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const {colors} = useTheme();
  const onPress = () => {
    navigation.navigate(Routes.SettingsStack, {
      screen: Routes.Settings,
    });
  };
  return (
    <View>
      <OpacityPressable onPress={onPress}>
        <FontAwesomeIcon icon={faBars} size={20} color={colors.textSecondary} />
      </OpacityPressable>
    </View>
  );
};

const BackButton = () => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  return (
    <OpacityPressable onPress={() => navigation.goBack()}>
      <FontAwesomeIcon
        icon={faChevronLeft}
        size={20}
        color={colors.textSecondary}
        style={{paddingLeft: 0}}
      />
    </OpacityPressable>
  );
};
