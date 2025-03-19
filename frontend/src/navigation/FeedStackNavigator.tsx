import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {FeedScreen} from '../screens/Feed/FeedScreen';
import {FeedStackParamList, Routes} from './Routes';
import {ProfileStackNavigator} from './ProfileStackNavigator';

const FeedStack = createStackNavigator<FeedStackParamList>();

export const FeedStackNavigator = () => {
  return (
    <FeedStack.Navigator screenOptions={{headerShown: false}}>
      <FeedStack.Screen name={Routes.Feed} component={FeedScreen} />
      <FeedStack.Screen
        name={Routes.ProfileStack}
        component={ProfileStackNavigator}
      />
    </FeedStack.Navigator>
  );
};
