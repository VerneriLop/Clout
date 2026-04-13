import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {Title1Text} from '../../components/ui/typography';
import {CameraStackParamList, Routes} from '../../navigation/Routes';

export const Overview = () => {
  const navigation = useNavigation<StackNavigationProp<CameraStackParamList>>();
  const handlePress = () => {
    navigation.navigate(Routes.Camera);
  };
  return (
    <ThemedSafeAreaView style={styles.container}>
      <Title1Text variant="heavy">Enter Competition</Title1Text>

      <View>
        <Text>Tietoa kilpailusta</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text>Take photo</Text>
        </TouchableOpacity>
      </View>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    padding: 32,
    borderRadius: 64,
    elevation: 2,
    backgroundColor: 'tomato',
  },
  buttonContainer: {
    flex: 1,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 16,
    justifyContent: 'flex-end',
  },
});
