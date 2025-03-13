import React, {useState} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedIcon, ThemedText} from '../../components/ui/typography';
import {Pressable, StyleSheet, View} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {CustomUser} from '../Profile/components/ProfileInfoCard';
import {faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';
import {
  faComment,
  faHeart as farHeart,
} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

type Props = {
  user: CustomUser;
  user_id: number;
  caption: string | null;
};

export const BottomBar = ({user, user_id, caption}: Props): JSX.Element => {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleNavigate = () => {
    console.log('NAVIGATE TO SPECIFIC PROFILE', user_id);
  };

  const likeImage = () => {
    setIsLiked(true);
    //TODO: Api call for liking the picture
  };

  const unLikeImage = () => {
    setIsLiked(false);
    //TODO: Api call for unliking the picture
  };

  return (
    <ThemedView style={[globalStyle.flex, style.container]}>
      <View style={style.likeCommentContainer}>
        {isLiked ? (
          <Pressable onPress={() => unLikeImage()}>
            <FontAwesomeIcon icon={fasHeart} color="red" size={25} />
          </Pressable>
        ) : (
          <Pressable onPress={() => likeImage()}>
            <ThemedIcon icon={farHeart} size={25} />
          </Pressable>
        )}
        <ThemedIcon icon={faComment} size={25} />
      </View>
      <Pressable onPress={() => handleNavigate()}>
        <ThemedText>{user.username}</ThemedText>
      </Pressable>
      <ThemedText>{caption}</ThemedText>
    </ThemedView>
  );
};

const style = StyleSheet.create({
  container: {
    height: verticalScale(65),
    justifyContent: 'space-between',
    flexDirection: 'column',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: horizontalScale(10),
    gap: 8,
    marginVertical: verticalScale(3),
  },
  likeCommentContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});
