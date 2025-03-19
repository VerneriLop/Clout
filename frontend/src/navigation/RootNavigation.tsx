import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';
import {loginUser} from '../redux/slices/userSlice';
import {mockUser} from '../screens/Profile/mocks';
import {ThemedView} from '../components/ui/themed-view';
import globalStyle from '../assets/styles/globalStyle';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen/RegisterScreen';
import {BottomTabNavigator} from './BottomTabNavigator';
import {RootStackParamList, Routes} from './Routes';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const data = {user: mockUser, accessToken: 'lol', refreshToken: 'lol'};
    dispatch(loginUser(data));
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.user);

  return (
    <ThemedView style={globalStyle.flex}>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {user.isAuthenticated ? (
          <RootStack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
          />
        ) : (
          <>
            <RootStack.Screen name={Routes.Login} component={LoginScreen} />
            <RootStack.Screen
              name={Routes.Register}
              component={RegisterScreen}
            />
          </>
        )}
      </RootStack.Navigator>
    </ThemedView>
  );
};
