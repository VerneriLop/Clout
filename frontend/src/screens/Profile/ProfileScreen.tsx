import React, {useEffect, useState} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ImageList} from './components/ImageList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemedView} from '../../components/ui/themed-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList, Routes} from '../../navigation/Routes';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, AppThunk, RootState} from '../../redux/store/store';
import {User} from '../../services/user/users';
import {ThemedText} from '../../components/ui/typography';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {CustomImage} from '../../services/image/images';
import {mockImageList, mockUserList} from '../Feed/mock';
import {
  fetchPosts,
  selectAllPosts,
  selectPostsStatus,
} from '../../redux/slices/profilePostsSlice';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

//Mock api call definitions; Only for testing purposes
const getUserById = async (id: number) => {
  return mockUserList.find(user => user.id === id);
};

export const ProfileScreen = ({
  route,
  navigation,
}: ProfileProps): JSX.Element => {
  //useEffect --> get image data, user,
  const {userId} = route.params;
  const loggedInUser = useSelector((state: RootState) => state.user.user);

  const imageData = useSelector(selectAllPosts);
  const dispatch = useDispatch<AppDispatch>();
  const postStatus = useSelector(selectPostsStatus);

  const [userToRender, setUserToRender] = useState<User | null>(null);
  //const [imageData, setImageData] = useState<CustomImage[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  console.log('render profilescreen');

  // fix: only now checks the first rendered users data
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts(userId));
    }
  }, [postStatus, dispatch, userId]);

  useEffect(() => {
    if (userId === loggedInUser?.id) {
      setUserToRender(loggedInUser);
      setLoading(false);
    } else if (userId) {
      const fetchUserData = async () => {
        try {
          const user = await getUserById(userId);
          setUserToRender(user);
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
    navigation.setOptions({headerTitle: userToRender?.username});
  }, [userId, loggedInUser, userToRender, navigation]);

  //useEffect(() => {
  // navigation.preload(Routes.ImageDetail, {imageId: 0, userId: 0}); // Preload in the background
  //}, [navigation]);

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
