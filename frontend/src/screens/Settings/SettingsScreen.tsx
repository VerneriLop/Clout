import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const SettingsScreen = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
