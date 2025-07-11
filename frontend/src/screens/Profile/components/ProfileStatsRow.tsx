import React, {useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';

import {faUserPen} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {launchImageLibrary} from 'react-native-image-picker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSelector} from 'react-redux';

import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../../../components/ProfilePicture/ProfilePicture';
import {
  BodyText,
  HeadlineText,
  ThemedIcon,
  ThemedText,
} from '../../../components/ui/typography';
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

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    flex: 1,
    opacity: scale.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.02, {stiffness: 100});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleProfilePicturePress = () => {
    changeProfilePicture();
  };

  return (
    <View style={styles.container}>
      {user.username === currentUsername ? (
        <Animated.View style={[animatedStyle, styles.profilePicture]}>
          <OpacityPressable
            onPress={() => handleProfilePicturePress()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            //style={styles.profilePicture}>
          >
            <ProfilePicture uri={user.profile_picture_url} size="large" />
            <View
              style={[
                styles.iconStyle,
                {
                  backgroundColor: colors.background,
                  shadowColor: colors.background,
                },
              ]}>
              <ThemedIcon icon={faUserPen} size={15} />
            </View>
          </OpacityPressable>
        </Animated.View>
      ) : (
        <View style={styles.profilePicture}>
          <ProfilePicture uri={user.profile_picture_url} size="large" />
        </View>
      )}
      <View style={styles.userNameAndBio}>
        <HeadlineText variant="bold">
          {user.first_name} {user.last_name}
        </HeadlineText>
        {user.bio ? <BodyText>{user.bio}</BodyText> : null}
      </View>
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
      <HeadlineText style={styles.statValue}>{value}</HeadlineText>
      <BodyText style={styles.statText}>{label}</BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  userNameAndBio: {paddingTop: 85, alignItems: 'center'},
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    //backgroundColor: 'red',
    flex: 1,
  },
  profilePicture: {position: 'absolute', top: -75, zIndex: 10},
  stats: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    //backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  statItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderColor: 'white',
    width: 80,
  },
  statValue: {
    textAlign: 'center',
    fontWeight: 'bold',
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
