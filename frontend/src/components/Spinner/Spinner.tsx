import React from 'react';
import {ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';

import {useTheme} from '@react-navigation/native';

type SpinnerProps = {
  size?: number | 'small' | 'large';
  style?: ViewStyle;
};

export const Spinner = ({size = 'large', style}: SpinnerProps): JSX.Element => {
  const {colors} = useTheme();
  return (
    <ActivityIndicator
      style={[styles.activityIndicator, style]}
      size={size}
      color={colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
