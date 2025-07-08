import React from 'react';

import {faMagnifyingGlass, faSearch} from '@fortawesome/free-solid-svg-icons';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ThemedIcon} from '../components/ui/typography';
import {FeedScreen} from '../screens/Feed/FeedScreen';
import {SearchScreen} from '../screens/Feed/SearchScreen';
import {ProfileStackNavigator} from './ProfileStackNavigator';
import {FeedStackParamList, Routes} from './Routes';

const FeedStack = createNativeStackNavigator<FeedStackParamList>();

export const FeedStackNavigator = () => {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name={Routes.Feed}
        component={FeedScreen}
        options={{
          headerShown: false,
          //headerSearchBarOptions: {},
          //headerStyle: {paddingVertical: 100},
          //headerRight: () => <ThemedIcon icon={faSearch} />,
          //title: '',
        }}
      />
      <FeedStack.Screen
        name={Routes.ProfileStack}
        component={ProfileStackNavigator}
        options={({theme}) => ({
          headerShown: false,
          headerStyle: {backgroundColor: theme.colors.background},
          headerBackButtonDisplayMode: 'minimal',
          title: '',
          headerShadowVisible: false,
        })}
      />
      <FeedStack.Screen
        name={Routes.Search}
        component={SearchScreen}
        options={({theme}) => ({
          headerShown: true,
          headerStyle: {backgroundColor: theme.colors.background},
          headerBackButtonDisplayMode: 'minimal',
          title: 'Search',
          headerShadowVisible: false,
          //headerSearchBarOptions: {},
          //presentation: 'modal',
        })}
      />
    </FeedStack.Navigator>
  );
};
