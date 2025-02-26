import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import style from './style';
import {scaleFontSize} from '../../assets/styles/scaling';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {ImageGrid} from './ImageGrid';
import {CustomUser} from './ProfileInfoSection';
import extendedMockImageList, {mockUser} from './mocks';
import {launchCamera} from 'react-native-image-picker';

const headerstyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
    paddingTop: globalStyle.defaultPadding.paddingVertical,
  },
  text: {
    fontWeight: 'bold',
    fontSize: scaleFontSize(20),
    textAlignVertical: 'bottom',
  },
});

type CustomPressableProps = {
  onPress: () => void;
  element: JSX.Element;
};

const CustomPressable = ({onPress, element}: CustomPressableProps) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      {
        opacity: pressed ? 0.5 : 1,
      },
    ]}>
    {element}
  </Pressable>
);

const HeaderBar = ({user}: {user: CustomUser}): JSX.Element => {
  return (
    <View style={headerstyle.container}>
      <Text style={headerstyle.text}>{user.username}</Text>
      <CustomPressable
        onPress={() => launchCamera({mediaType: 'photo'})}
        element={<FontAwesomeIcon icon={faBars} size={20} />}
      />
    </View>
  );
};

export const ProfileScreen = (): JSX.Element => {
  //useEffect --> get image data, user,
  return (
    <View style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <HeaderBar user={mockUser} />
      <View style={style.divider} />
      <ImageGrid data={extendedMockImageList} />
    </View>
  );
};
