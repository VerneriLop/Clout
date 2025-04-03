import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Pressable} from 'react-native';
import {RootStackParamList, Routes} from '../../navigation/Routes';
import {ThemedText} from '../ui/typography';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfilePicture} from '../ProfilePicture/ProfilePicture';
import {OpacityPressable} from '../OpacityPressable/OpacityPressable';
import {CommentType} from '../../types/types';
import {useGetUserByIdQuery} from '../../redux/slices/mockApiSlice';

type CommentListItemProps = {
  comment: CommentType;
  size?: 'small' | 'medium' | 'large';
  onItemPress?: () => void;
};

export const CommentListItem = ({
  comment,
  size = 'small',
  onItemPress,
}: CommentListItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const {data: user = null} = useGetUserByIdQuery(comment.user_id, {
    skip: !comment,
  });

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    onItemPress?.();
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {userId: comment.user_id, username: user?.username ?? ''},
    });
  };

  return (
    <View style={styles.container}>
      <OpacityPressable onPress={handlePress}>
        <ProfilePicture uri={user?.profile_picture_url ?? ''} size={size} />
      </OpacityPressable>
      <View style={styles.textContainer}>
        <OpacityPressable onPress={handlePress}>
          <ThemedText style={styles.username}>{user?.username}</ThemedText>
        </OpacityPressable>
        <Pressable onPress={() => !expanded && setExpanded(true)}>
          <ThemedText numberOfLines={expanded ? undefined : 2}>
            {comment.comment}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
  },
  username: {
    fontWeight: 'bold',
  },
});
