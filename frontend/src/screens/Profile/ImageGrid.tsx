import React, {useState} from 'react';
import {Pressable, Image, View, FlatList} from 'react-native';
import {CustomImage} from '../../services/image/images';
import style from './style';
import {ProfileInfoSection} from './ProfileInfoSection';
import {mockUser} from './mocks';

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
    <View>
      <FlatList
        ListHeaderComponent={<ProfileInfoSection user={mockUser} />}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        numColumns={3}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};
