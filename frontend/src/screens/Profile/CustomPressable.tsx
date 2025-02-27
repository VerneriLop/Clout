import React from 'react';
import {StyleProp, ViewStyle, Pressable} from 'react-native';

type CustomPressableProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  pressedStyle?: (pressed: boolean) => StyleProp<ViewStyle>;
};
/* Custom wrapper for making pressables of child components*/
export const CustomPressable = ({
  onPress,
  style,
  children,
  pressedStyle,
}: CustomPressableProps) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      pressedStyle ? pressedStyle(pressed) : {opacity: pressed ? 0.7 : 1},
      style,
    ]}>
    {children}
  </Pressable>
);
