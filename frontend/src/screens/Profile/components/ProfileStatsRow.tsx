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
        <OpacityPressable
          onPress={() => changeProfilePicture()}
          style={styles.profilePicture}>
          <ProfilePicture uri={user.profile_picture_url} size="large" />
          <View
            style={[
              styles.iconStyle,
              {backgroundColor: colors.card, shadowColor: colors.card},
            ]}>
            <ThemedIcon icon={faUserPen} size={15} />
          </View>
        </OpacityPressable>
      ) : (
        <View style={styles.profilePicture}>
          <ProfilePicture uri={user.profile_picture_url} size="large" />
        </View>
      )}
      <View style={styles.stats}>
        <ProfileStatItem value={user.num_posts} label={'posts'} />
        <OpacityPressable onPress={onPressFollowing}>
          <ProfileStatItem value={user.num_following} label={'following'} />
        </OpacityPressable>
        <OpacityPressable onPress={onPressFollowers}>
          <ProfileStatItem value={user.num_followers} label={'followers'} />
        </OpacityPressable>
      </View>
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
    flexDirection: 'column',
    alignItems: 'center',
    gap: 25,
  },
  profilePicture: {position: 'absolute', top: -75},
  stats: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 90,
  },
  statItem: {
    //flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    //backgroundColor: 'tomato',
    //borderColor: 'white',
    //borderWidth: 2,
    width: 80,
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
    bottom: 4,
    right: 15,
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
