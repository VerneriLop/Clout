import React from 'react';
import {StyleSheet, View} from 'react-native';

import {faUserPen} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';

import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../../../components/ProfilePicture/ProfilePicture';
import {ThemedIcon, ThemedText} from '../../../components/ui/typography';
import {useTheme} from '../../../hooks/useTheme';
import {ProfileStackParamList} from '../../../navigation/Routes';
import {useUpdateUserMeMutation} from '../../../redux/api/endpoints/users';
import {RootState} from '../../../redux/store/store';

import {ProfileType} from '../../../types/types';

export const ProfileStatsRow = ({user}: {user: ProfileType}) => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const [updateProfilePicture] = useUpdateUserMeMutation();
  const currentUsername = useSelector(
    (state: RootState) => state.auth.username,
  );
  const {colors} = useTheme();

  const onPressFollowing = () => {
    navigation.navigate('Followers', {index: 0, username: user.username});
  };
  const onPressFollowers = () => {
    navigation.navigate('Followers', {index: 1, username: user.username});
  };

  const changeProfilePicture = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    console.log('Result.assets', result.assets);
    if (result.assets) {
      updateProfilePicture({profile_picture_url: result.assets[0].uri});
    }
  };

  return (
    <View style={styles.container}>
      {user.username === currentUsername ? (
        <OpacityPressable onPress={() => changeProfilePicture()}>
          <ProfilePicture uri={user.profile_picture_url} />
          <View
            style={[
              styles.iconStyle,
              {backgroundColor: colors.card, shadowColor: colors.card},
            ]}>
            <ThemedIcon icon={faUserPen} size={15} />
          </View>
        </OpacityPressable>
      ) : (
        <ProfilePicture uri={user.profile_picture_url} />
      )}

      <ProfileStatItem value={user.num_posts} label={'posts'} />
      <OpacityPressable onPress={onPressFollowing} style={styles.statItem}>
        <ProfileStatItem value={user.num_following} label={'following'} />
      </OpacityPressable>
      <OpacityPressable onPress={onPressFollowers} style={styles.statItem}>
        <ProfileStatItem value={user.num_followers} label={'followers'} />
      </OpacityPressable>
    </View>
  );
};

const ProfileStatItem = ({value, label}: {value: number; label: string}) => {
  return (
    <View style={styles.statItem}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statText}>{label}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statValue: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statText: {
    textAlign: 'center',
  },
  iconStyle: {
    position: 'absolute',
    bottom: -2,
    right: 0,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    paddingLeft: 3,
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
});
