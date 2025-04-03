import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import style from './style';
import {useTheme} from '@react-navigation/native';

type Props = {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

const Input = ({
  label,
  containerStyle,
  style: inputStyle,
  ...props
}: Props): JSX.Element => {
  const {colors} = useTheme();

  return (
    <View style={containerStyle}>
      {label && <Text style={style.label}>{label}</Text>}
      <TextInput
        {...props}
        placeholderTextColor={colors.border}
        style={[style.input, {color: colors.text}, inputStyle]}
      />
    </View>
  );
};

export default Input;
