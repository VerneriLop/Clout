import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {FeedScreen} from '../screens/Feed/FeedScreen';
import {ProfileStackNavigator} from './ProfileStackNavigator';
import {FeedStackParamList, Routes} from './Routes';

const FeedStack = createNativeStackNavigator<FeedStackParamList>();

export const FeedStackNavigator = () => {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name={Routes.Feed}
        component={FeedScreen}
        options={{headerShown: false}}
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
    </FeedStack.Navigator>
  );
};
