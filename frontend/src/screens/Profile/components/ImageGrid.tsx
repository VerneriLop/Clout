import React, {useState} from 'react';
import {Pressable, Image, View, FlatList, StyleSheet} from 'react-native';
import {CustomImage} from '../../../services/image/images';
import style from '../style';
import {ProfileInfoSection} from './ProfileInfoSection';
import {mockUser} from '../mocks';
import {Text} from 'react-native-gesture-handler';
import {scaleFontSize, verticalScale} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';

type ImageBoxProps = {
  image: CustomImage;
  onPress: () => void;
};

const ImageBox = ({image, onPress}: ImageBoxProps): JSX.Element => (
  <>
    <Pressable
      style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
      onPress={onPress}>
      <Image
        source={{uri: image.image_url}}
        resizeMode="cover"
        style={style.imageBox}
      />
    </Pressable>
  </>
);

const ListFooter = ({numPosts}: {numPosts: number}): JSX.Element => (
  <View>
    <Text style={style.boxText}>{`${numPosts} images`}</Text>
  </View>
);

const placeholderStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: verticalScale(100),
  },
  text: {
    fontSize: scaleFontSize(28),
    fontWeight: 'bold',
  },
  icon: {
    height: verticalScale(100),
    width: verticalScale(100),
    borderRadius: verticalScale(100),
    borderWidth: StyleSheet.hairlineWidth * 5,
    alignItems: 'center',
  },
});

const ListPlaceholder = () => (
  <View style={placeholderStyle.container}>
    <Text style={placeholderStyle.text}>No posts yet</Text>
  </View>
);

// investigate do we need to order the list by date, or backend handles it
export const ImageGrid = ({data}: {data: CustomImage[]}): JSX.Element => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({item}: {item: CustomImage}) => {
    return (
      <ImageBox
        image={item}
        onPress={() => console.log(`pressed image id: ${item.id}`)}
      />
    );
  };

  return (
    <View style={globalStyle.flex}>
      <FlatList
        ListHeaderComponent={<ProfileInfoSection user={mockUser} />}
        ListFooterComponent={
          data ? null : <ListFooter numPosts={mockUser.num_posts} />
        }
        ListEmptyComponent={<ListPlaceholder />}
        data={[]}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        numColumns={3}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};
