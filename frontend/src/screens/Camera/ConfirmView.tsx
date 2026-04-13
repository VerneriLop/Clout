import {useState} from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {Image} from 'expo-image';
import {ScrollView} from 'react-native-gesture-handler';

import Button from '../../components/Button/Button';
import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {
  ThemedText,
  Title1Text,
  Title2Text,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';

type ConfirmFormProps = {
  uri: string;
  onCancel: () => void;
  onSubmit: () => void;
};
// confirm form
export const ConfirmView = ({uri, onCancel, onSubmit}: ConfirmFormProps) => {
  const {colors} = useTheme();
  const [text, onChangeText] = useState('');
  const [visibility, setVisibility] = useState(false);

  const handleSubmit = () => {};

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Title1Text variant="heavy">Submit Photo</Title1Text>
        </View>

        <View style={[styles.cardContainer, {backgroundColor: colors.card}]}>
          <View style={styles.imageContainer}>
            <Image source={{uri}} contentFit="contain" style={[styles.image]} />
          </View>

          <View style={[styles.inputContainer]}>
            <ThemedText>Describe your photo</ThemedText>
            <TextInput
              inputMode="text"
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
              value={text}
              onChangeText={onChangeText}
              placeholderTextColor={colors.border}
              placeholder="Beautiful day at the coastline..."
            />
            <View style={styles.switchContainer}>
              <ThemedText>Visibility</ThemedText>
              <Switch
                onValueChange={() =>
                  setVisibility(previousState => !previousState)
                }
                value={visibility}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={[styles.button, {backgroundColor: colors.primary}]}
            underlayColor={colors.highlighted}
            onPress={onSubmit}>
            <Title3Text variant={'medium'} style={{color: 'white'}}>
              Submit
            </Title3Text>
          </TouchableHighlight>
          <TouchableOpacity onPress={onCancel}>
            <ThemedText style={{color: colors.warning}}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    margin: 16,
  },
  image: {
    //width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    //backgroundColor: 'red',
  },
  header: {
    padding: 8,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 24,
    elevation: 2,
  },
  buttonContainer: {
    padding: 8,
    paddingTop: 16,
    alignItems: 'center',
    gap: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  input: {
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 8,
  },
  cardContainer: {
    elevation: 2,
    marginHorizontal: 8,
    //paddingTop: 16,
    borderRadius: 16,
  },
  container: {
    flex: 1,
    //elevation: 2,
    //margin: 16,
    // padding: 4,
    //borderRadius: 16,
  },

  inputContainer: {
    //elevation: 2,
    padding: 16,
    //gap: 8,
    borderRadius: 16,
    //marginTop: 16,
  },
});
