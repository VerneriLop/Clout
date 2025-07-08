import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {ThemedText} from '../../../components/ui/typography';
import {
  useCreateFollowMutation,
  useDeleteFollowMutation,
  useGetUsersMeQuery,
} from '../../../redux/api/endpoints/users';
import {ProfileStatsRow} from './ProfileStatsRow';

import {ProfileType} from '../../../types/types';

export const ProfileInfoCard = ({profileUser}: {profileUser: ProfileType}) => {
  const {colors} = useTheme();
  const {data: loggedInUser} = useGetUsersMeQuery();
  const loggedInUserId = loggedInUser?.id;
  const [followUser, {isLoading: isFollowingUser}] = useCreateFollowMutation();
  const [unfollowUser, {isLoading: isUnfollowingUser}] =
    useDeleteFollowMutation();
  const isMutationLoading = isFollowingUser || isUnfollowingUser;
  const [isFollowing, setIsFollowing] = useState(
    profileUser.is_followed_by_current_user,
  );

  const handleFollowToggle = useCallback(async () => {
    if (!loggedInUserId || isMutationLoading) {
      return;
    }
    const mutationPayload = {
      user_id: profileUser.id,
      username: profileUser.username,
    };
    try {
      if (isFollowing) {
        await unfollowUser(mutationPayload).unwrap();
      } else {
        await followUser(mutationPayload).unwrap();
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow state:', error);
    }
  }, [
    loggedInUserId,
    profileUser,
    isFollowing,
    followUser,
    unfollowUser,
    isMutationLoading,
  ]);

  const showButton = loggedInUser && profileUser.id !== loggedInUser.id;
  const buttonText = isFollowing ? 'Following' : 'Follow';

  const dynamicButtonStyle: StyleProp<ViewStyle> = isFollowing
    ? [
        styles.button,
        {borderColor: colors.primary, backgroundColor: colors.card},
      ]
    : [
        styles.button,
        {backgroundColor: colors.primary, borderColor: colors.primary},
      ];

  const dynamicButtonTextStyle = isFollowing
    ? [styles.buttonText, {color: colors.primary}]
    : [styles.buttonText, {color: colors.card}];

  return (
    <View style={[styles.container]}>
      <View
        style={[styles.backgroundImage, {backgroundColor: colors.background}]}>
        {/*<Image
          source={{
            uri: 'https://i.guim.co.uk/img/media/b1c1caa029d6f186f9d6b3fabb7f02517eb9c33b/0_58_2528_1519/master/2528.jpg?width=1200&quality=85&auto=format&fit=max&s=a80cc1503df75e0c9d04b78ed226229e',
          }}
          style={{width: '100%', height: '100%'}}
        />*/}
      </View>
      {/*<LinearGradient
        colors={[colors.background, colors.text]}
        style={styles.gradient}
        locations={[0, 1]}
      />*/}
      <View
        style={{
          backgroundColor: colors.card,
        }}>
        <View>
          <ProfileStatsRow user={profileUser} />
        </View>
        {showButton && (
          <View style={styles.buttonContainer}>
            <OpacityPressable
              style={dynamicButtonStyle}
              onPress={handleFollowToggle}
              disabled={isMutationLoading}>
              {isMutationLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isFollowing ? colors.primary : colors.card}
                />
              ) : (
                <ThemedText style={dynamicButtonTextStyle}>
                  {buttonText}
                </ThemedText>
              )}
            </OpacityPressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  gradient: {
    position: 'absolute',
    height: 180,
    width: '100%',
    zIndex: 1,
    opacity: 0.6,
  },

  backgroundImage: {height: 180},
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexGrow: 1,
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 35,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  defaultMargin: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});
