import React from 'react';
import {Alert, StyleSheet, TextInput, TextInputProps, View} from 'react-native';

import {faCircleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useFormik} from 'formik';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedView} from '../../components/ui/themed-view';
import {Title2Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';

export const GeneralScreen = () => {
  const {colors} = useTheme();

  const formik = useFormik({
    initialValues: {
      username: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: values => {
      Alert.alert(
        'Change username',
        'You can only change your username once in 30 days.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => console.log('Submitted values:', values),
          },
        ],
      );
    },
  });

  return (
    <ThemedView style={styles.container}>
      <Title2Text variant="bold">Change username</Title2Text>
      <InputWithButton
        name="username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        handleSubmit={formik.handleSubmit}
        placeholder="username"
      />
      <Title2Text variant="bold">Change Password</Title2Text>
      <InputWithButton
        name="currentPassword"
        value={formik.values.currentPassword}
        onChangeText={formik.handleChange('currentPassword')}
        placeholder="current password"
        secureTextEntry
        showButton={false}
      />
      <InputWithButton
        name="newPassword"
        value={formik.values.newPassword}
        onChangeText={formik.handleChange('newPassword')}
        placeholder="new password"
        secureTextEntry
        showButton={false}
      />
      <InputWithButton
        name="confirmPassword"
        value={formik.values.confirmPassword}
        onChangeText={formik.handleChange('confirmPassword')}
        handleSubmit={formik.handleSubmit}
        placeholder="new password again"
        secureTextEntry
      />
    </ThemedView>
  );
};

type InputCardProps = {
  handleSubmit?: () => void;
  showButton?: boolean;
  name: string;
  value: string;
  onChangeText: (text: string) => void;
} & TextInputProps;

const InputWithButton = ({
  handleSubmit,
  showButton = true,
  value,
  onChangeText,
  ...props
}: InputCardProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.inputAndButton,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>
      <TextInput
        inputMode="text"
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.border}
        maxLength={25}
        {...props}
      />
      {showButton && handleSubmit && (
        <OpacityPressable onPress={handleSubmit}>
          <FontAwesomeIcon
            icon={faCircleRight}
            color={colors.primary}
            size={20}
          />
        </OpacityPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
  },
  inputAndButton: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    padding: 10,
  },
});
