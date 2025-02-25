import React from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import style from './style';
import {scaleFontSize} from '../../assets/styles/scaling';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {ImageGrid} from './ImageGrid';
import {CustomUser} from './ProfileInfoSection';
import extendedMockImageList, {mockUser} from './mocks';

const HeaderBar = ({user}: {user: CustomUser}): JSX.Element => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
      paddingTop: globalStyle.defaultPadding.paddingVertical,
    }}>
    <Text
      style={{
        fontWeight: 'bold',
        fontSize: scaleFontSize(20),
        textAlignVertical: 'bottom',
      }}>
      {user.username}
    </Text>
    <Pressable onPress={() => console.log('pressed')}>
      <FontAwesomeIcon icon={faBars} size={20} />
    </Pressable>
  </View>
);

// main / upper screen
export const ProfileScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <HeaderBar user={mockUser} />
      <View style={style.divider} />
      <ImageGrid data={extendedMockImageList} />
    </SafeAreaView>
  );
};
