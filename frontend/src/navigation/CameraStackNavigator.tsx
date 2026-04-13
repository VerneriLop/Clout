import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {CameraScreen} from '../screens/Camera/CameraScreen';
import {Overview} from '../screens/Camera/Overview';
import {CameraStackParamList, Routes} from './Routes';

const CameraStack = createStackNavigator<CameraStackParamList>();

export const CameraStackNavigator = () => {
  return (
    <CameraStack.Navigator screenOptions={{headerShown: false}}>
      <CameraStack.Screen name={Routes.Overview} component={Overview} />
      <CameraStack.Screen
        name={Routes.Camera}
        component={CameraScreen}
        options={{presentation: 'modal'}}
        //options={{tabBarStyle: {display: 'none'}}}
      />
    </CameraStack.Navigator>
  );
};
