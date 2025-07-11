import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

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
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          height: layout.height / 2 - insets.top - insets.bottom - 40, // tabBar height fixed 40
          //pointerEvents: 'box-none',
        },
      ]}>
      <View
        style={[
          styles.backgroundImage,
          {backgroundColor: colors.background},
        ]}></View>

      <ProfileStatsRow user={profileUser} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    height: 180,
    width: '100%',
    zIndex: 1,
    opacity: 0.6,
  },

  backgroundImage: {height: 99},
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
