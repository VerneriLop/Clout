import {Dispatch, SetStateAction} from 'react';
import {StyleSheet, TextInput} from 'react-native';

import {BottomSheetTextInput} from '@gorhom/bottom-sheet';

import {useTheme} from '../../hooks/useTheme';

type SearchProps = {
  onModal: boolean;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export const Search = ({onModal, value, setValue}: SearchProps) => {
  const {colors} = useTheme();

  const SearchInput = onModal ? BottomSheetTextInput : TextInput;
  return (
    <SearchInput
      placeholder="Search"
      inputMode="search"
      autoCapitalize="none"
      clearButtonMode="while-editing"
      style={[
        styles.input,
        {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border,
        },
      ]}
      value={value}
      onChangeText={setValue}
      placeholderTextColor={colors.border}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: 'white',
  },
});
