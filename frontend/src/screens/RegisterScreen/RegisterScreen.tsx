import React from 'react';
import {Text, SafeAreaView} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';

export const RegisterScreen = () => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Text>Rekisteröitymis näkymä</Text>
    </SafeAreaView>
  );
};
