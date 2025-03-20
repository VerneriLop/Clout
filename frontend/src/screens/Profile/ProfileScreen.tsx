import React, {useEffect, useState} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ImageList} from './components/ImageList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemedView} from '../../components/ui/themed-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigation/Routes';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {User} from '../../services/user/users';
import {ThemedText} from '../../components/ui/typography';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {CustomImage} from '../../services/image/images';
import {mockImageList, mockUserList} from '../Feed/mock';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

//Mock api call definitions; Only for testing purposes
const getUserById = async (id: number) => {
  return mockUserList.find(user => user.id === id);
};

const getImagesByUser = async (id: number) => {
  return mockImageList.filter(img => img.id === id);
};

export const ProfileScreen = ({route}: ProfileProps): JSX.Element => {
  //useEffect --> get image data, user,
  const {userId} = route.params;
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  const [userToRender, setUserToRender] = useState<User | null>(null);
  const [imageData, setImageData] = useState<CustomImage[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getImagesByUser(userId);
        setImageData(images);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (userId === loggedInUser?.id) {
      setUserToRender(loggedInUser);
      fetchImages();
      setLoading(false);
    } else if (userId) {
      const fetchUserData = async () => {
        try {
          const user = await getUserById(userId);
          setUserToRender(user);
          fetchImages();
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, loggedInUser]);

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.activityIndicator}
        size="large"
        color="tomato"
      />
    );
  }

  if (!userToRender) {
    return (
      <ThemedView>
        <ThemedText>Error getting profile</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[globalStyle.flex, {paddingTop: insets.top}]}>
      <ImageList data={imageData} user={userToRender} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});
