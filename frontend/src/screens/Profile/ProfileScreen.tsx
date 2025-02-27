import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ImageGrid} from './components/ImageGrid';
import extendedMockImageList, {mockUser} from './mocks';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileHeader} from './components/ProfileHeader';

export const ProfileScreen = (): JSX.Element => {
  //useEffect --> get image data, user,
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <ProfileHeader user={mockUser} />
      <ImageGrid data={extendedMockImageList} />
    </SafeAreaView>
  );
};
