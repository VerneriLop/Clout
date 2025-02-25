import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {scaleFontSize} from '../../assets/styles/scaling';
import style from './style';

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
        <Text
          style={{
            textAlign: 'center',
            fontSize: scaleFontSize(15),
            fontWeight: 'bold',
          }}>
          {text}
        </Text>
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
  <View style={style.container}>
    <UserInfoBar user={user} />
    <View style={{paddingBottom: 10}}>
      <Text style={style.name}>{user.username}</Text>
      <Text>{user.bio}</Text>
    </View>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 6,
      }}>
      <ProfileActionButton text="Edit profile" />
      <ProfileActionButton text="Share profile" />
    </View>
  </View>
);
