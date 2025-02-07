import React from 'react';
import {Text, SafeAreaView, View} from 'react-native';
import style from './style';
import globalStyle from '../../assets/styles/globalStyle';

export const LoginScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View>
        <Text style={style.registerLink}>Ei tiliä? Luo käyttäjä</Text>
      </View>
    </SafeAreaView>
  );
};
