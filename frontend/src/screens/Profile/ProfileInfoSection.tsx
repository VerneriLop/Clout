import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {scaleFontSize, verticalScale} from '../../assets/styles/scaling';
import style from './style';
import globalStyle from '../../assets/styles/globalStyle';

const UserInfoBox = ({
  count,
  text,
}: {
  count: number;
  text: string;
}): JSX.Element => {
  return (
    <View style={style.box}>
      <Text style={style.boxNumber}>{count}</Text>
      <Text style={style.boxText}>{text}</Text>
    </View>
  );
};

const ProfilePicture = ({uri}: {uri: string}) => {
  return (
    <View>
      <Image source={{uri}} resizeMode="cover" style={style.image} />
    </View>
  );
};

const UserInfoBar = ({user}: {user: CustomUser}): JSX.Element => {
  return (
    <View style={style.infoBar}>
      <ProfilePicture uri={user.profile_picture_url} />
      <UserInfoBox count={user.num_posts} text={'posts'} />
      <UserInfoBox count={user.num_followers} text={'followers'} />
      <UserInfoBox count={user.num_following} text={'following'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: verticalScale(10),
    flexDirection: 'column',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: scaleFontSize(15),
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  defaultMargin: {
    marginVertical: verticalScale(10),
  },
});

const ProfileActionButton = ({text}: {text: string}): JSX.Element => {
  return (
    <View>
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#f0f0f0' : 'white', //'#f5f5f5' : '#f0f0f0',
          },
          style.button,
        ]}
        onPress={() => console.log('press profileactionbutton')}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
};

export type CustomUser = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  num_followers: number;
  num_following: number;
  profile_picture_url: string;
  num_posts: number;
};

export const ProfileInfoSection = ({user}: {user: CustomUser}): JSX.Element => (
  <View style={styles.container}>
    <UserInfoBar user={user} />
    <View style={styles.defaultMargin}>
      <Text style={style.name}>{user.username}</Text>
      <Text>{user.bio}</Text>
    </View>
    <View style={styles.buttonContainer}>
      <ProfileActionButton text="Edit profile" />
      <ProfileActionButton text="Share profile" />
    </View>
  </View>
);
