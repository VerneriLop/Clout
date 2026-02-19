import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

import {faCircleUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {OpacityPressable} from '../OpacityPressable/OpacityPressable';

type CommentFooterType = {
  handleAddComment: (input: string) => void;
  blurred?: boolean;
};

export const CommentInputFooter = ({
  handleAddComment,
  blurred = false,
  ...props
}: CommentFooterType) => {
  const [input, setInput] = useState('');
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const addComment = () => {
    handleAddComment(input);
    setInput('');
  };

  const footerStyle: ViewStyle = {
    paddingBottom: insets.bottom,
    backgroundColor: colors.card,
    ...(blurred ? {opacity: 0.1} : {}),
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.bottom}>
      <View style={[styles.footerContainer, footerStyle]}>
        <TextInput
          style={[
            styles.input,
            {color: colors.text, backgroundColor: colors.border},
          ]}
          placeholder="Write a comment"
          placeholderTextColor={colors.card}
          value={input}
          onChangeText={setInput}
        />

        <OpacityPressable disabled={input.length < 1} onPress={addComment}>
          <FontAwesomeIcon icon={faCircleUp} color={colors.primary} size={25} />
        </OpacityPressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 4,
    margin: 4,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
  },
});
