import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from 'expo-camera';
import {Image} from 'expo-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {ConfirmView} from './ConfirmView';

export const CameraScreen = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) setUri(photo.uri);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlashMode = () => {
    setFlashMode(current => (current === 'off' ? 'on' : 'off'));
  };

  const renderCamera = () => {
    return (
      <ThemedSafeAreaView style={{flex: 1}}>
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            ref={ref}
            mode={'picture'}
            facing={facing}
            flash={flashMode}
            ratio="4:3"
          />

          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={toggleFlashMode}>
              <Ionicons
                name={
                  flashMode === 'off' ? 'flash-off-outline' : 'flash-outline'
                }
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.backButton}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}>
              <Ionicons name={'close'} size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <View style={{flex: 1}} />

          <TouchableOpacity onPress={takePicture}>
            <View style={styles.shutterButton} />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.orientationButton}
              onPress={toggleCameraFacing}>
              <Ionicons name="sync" size={36} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ThemedSafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? (
        <ConfirmView
          uri={uri}
          onCancel={() => setUri(null)}
          onSubmit={() => null}
        />
      ) : (
        renderCamera()
      )}
    </View>
  );
};

const SHUTTER_SIZE = 84;

const styles = StyleSheet.create({
  orientationButton: {
    //backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 4,
    borderRadius: 99,

    //elevation: 0.5,
  },
  backButton: {
    position: 'absolute',
    left: 6,
    top: 18,
  },
  controls: {
    position: 'absolute',
    right: 6,
    top: 18,
  },
  cameraWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: 'red',
    elevation: 2,
  },
  bottomButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    //paddingBottom: 16,
    //elevation: 2,
    //maxHeight: 120,
    //backgroundColor: 'black',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 99,
    elevation: 18,
  },
  shutterButton: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
    borderRadius: SHUTTER_SIZE,
    borderWidth: 8,
    borderColor: 'white',
    elevation: 0.9,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
/*Reanimated.addWhitelistedNativeProps({zoom: true});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

export const CameraScreen = () => {
  const zoomOffset = useSharedValue(0);
  const [flashMode, setFlashMode] = useState<'on' | 'off' | 'auto'>('off');
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [photo, setPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hasPosted, setHasPosted] = useState(false); // TODO: init from server
  const [createPost, {isLoading: isCreatingPost}] = useCreatePostMutation();

  const navigation = useNavigation();

  const devices = useCameraDevices();
  const frontCamera = devices.find(device => device.position === 'front');
  const backCamera = devices.find(device => device.position === 'back');

  const activeDevice: CameraDevice =
    cameraType === 'front'
      ? (frontCamera ?? backCamera!)
      : (backCamera ?? frontCamera!);

  const zoom = useSharedValue(activeDevice?.neutralZoom ?? 1);
  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({zoom: zoom.value}),
    [zoom],
  );

  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;
  const RETRY_INTERVAL_MS = 1000;

  useFocusEffect(
    useCallback(() => {
      setRetryCount(0); // reset on screen entry
    }, []),
  );

  useEffect(() => {
    if (activeDevice) {
      return;
    }

    if (retryCount < MAX_RETRIES) {
      const timeout = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, RETRY_INTERVAL_MS);

      return () => clearTimeout(timeout);
    } else {
      Alert.alert('Error', 'No camera device found', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  }, [retryCount, activeDevice, navigation]);

  const cameraRef = useRef<Camera>(null);
  const {hasPermission, requestPermission} = useCameraPermission();

  if (!hasPermission) {
    requestPermission();
    return <Text>Requesting camera permission...</Text>;
  }

  if (!activeDevice) {
    return <Spinner />;
  }

  const minZoom = activeDevice?.minZoom ?? 1;
  const maxZoom = Math.min(activeDevice?.maxZoom ?? 10, 10);

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate(e => {
      const newZoom = zoomOffset.value * e.scale;
      zoom.value = interpolate(
        newZoom,
        [1, 10],
        [minZoom, maxZoom],
        Extrapolation.CLAMP,
      );
    });

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePhoto({
        flash: flashMode,
      });
      setPhoto(`file://${photoData.path}`);
    }
  };

  const toggleCamera = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const confirmPhoto = async () => {
    const filename = `${Date.now()}.jpg`;
    const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    if (photo) {
      await RNFS.copyFile(photo, localPath);
    } else {
      Alert.alert('Error saving photo');
      return;
    }
    const fileUrl = `file://${localPath}`;

    const createPostPayload = {
      image_url: fileUrl,
      caption: caption || undefined,
      is_visible: true,
    };
    try {
      const payload = await createPost(createPostPayload).unwrap();
      console.log('fulfilled:', payload);
    } catch (error) {
      console.log('error', error);
      setNotification({
        type: 'error',
        message: 'Error saving photo',
      });
      return;
    }
    setNotification({
      type: 'success',
      message: 'Photo taken successfully',
    });
    setPhoto(null);
    setHasPosted(true);
  };

  const cancelPhoto = () => {
    setPhoto(null);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleFlashMode = () => {
    setFlashMode(prev =>
      prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off',
    );
  };

  return hasPosted ? (
    <ThemedSafeAreaView style={styles.hasVoted}>
      <ThemedText>You already have posted for this competition</ThemedText>
    </ThemedSafeAreaView>
  ) : (
    <View style={Style.container}>
      {!photo ? (
        <>
          <GestureDetector gesture={pinchGesture}>
            <ReanimatedCamera
              ref={cameraRef}
              style={Style.camera}
              device={activeDevice}
              isActive
              photo
              animatedProps={animatedProps}
            />
          </GestureDetector>
          <TouchableOpacity onPress={handleBack} style={Style.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFlashMode} style={Style.flashButton}>
            <View>
              <FontAwesomeIcon
                icon={faBolt}
                size={flashMode === 'auto' ? 20 : 30}
                color={flashMode === 'off' ? 'grey' : 'white'}
              />
              {flashMode === 'off' && (
                <FontAwesomeIcon
                  icon={faSlash}
                  size={32}
                  color="grey"
                  style={Style.flashSlashIcon}
                />
              )}
            </View>
            {flashMode === 'auto' && <Text style={Style.flashText}>AUTO</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleCamera}
            style={Style.changeCameraButton}>
            <FontAwesomeIcon icon={faSync} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={Style.captureButton}>
            <FontAwesomeIcon icon={faCamera} size={40} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <ThemedSafeAreaView style={styles.previewContainer}>
          <Image source={{uri: photo}} style={styles.previewImage} />
          <Input
            label="Caption"
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
            containerStyle={styles.inputContainer}
            autoCapitalize="none"
          />
          <View style={styles.previewControls}>
            <TouchableOpacity
              onPress={cancelPhoto}
              style={Style.cancelButton}
              disabled={isCreatingPost}>
              <FontAwesomeIcon icon={faTimes} size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmPhoto}
              style={Style.confirmButton}
              disabled={isCreatingPost}>
              <FontAwesomeIcon icon={faCheck} size={30} color="white" />
            </TouchableOpacity>
          </View>
        </ThemedSafeAreaView>
      )}
    </View>
  );
};*/
