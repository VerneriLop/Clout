import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';

import {
  faArrowLeft,
  faBolt,
  faCamera,
  faCheck,
  faSlash,
  faSync,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Camera,
  CameraDevice,
  CameraProps,
  useCameraDevices,
  useCameraPermission,
} from 'react-native-vision-camera';

import {Spinner} from '../../components/Spinner/Spinner';
import {Style} from './style';

Reanimated.addWhitelistedNativeProps({zoom: true});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

export const CameraScreen = (): JSX.Element => {
  const zoomOffset = useSharedValue(0);
  const [flashMode, setFlashMode] = useState<'on' | 'off' | 'auto'>('off');
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [photo, setPhoto] = useState<string | null>(null);

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

  console.log(frontCamera, backCamera);

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

  const confirmPhoto = () => {
    // TODO: logic
    console.log('Sending image:', photo);
    setPhoto(null);
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

  return (
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
        <View style={Style.previewContainer}>
          <Image source={{uri: photo}} style={Style.previewImage} />

          <View style={Style.previewControls}>
            <TouchableOpacity onPress={cancelPhoto} style={Style.cancelButton}>
              <FontAwesomeIcon icon={faTimes} size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmPhoto}
              style={Style.confirmButton}>
              <FontAwesomeIcon icon={faCheck} size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
