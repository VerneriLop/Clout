import React, {useEffect, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import {styles} from './style';
import {useDispatch, useSelector} from 'react-redux';
import {updateNewVoteImages} from '../../redux/slices/voteImageSlice';
import extendedMockImageList from './mock';
import {RootState} from '../../redux/store/store';

export const VoteScreen = (): JSX.Element => {
  const dispatch = useDispatch();
  const [voteImageCount, setVoteImageCount] = useState<number>(0);

  useEffect(() => {
    dispatch(updateNewVoteImages({imageTupleList: extendedMockImageList}));
  }, [dispatch]);

  const translateX = useSharedValue(0);
  const leftTranslateY = useSharedValue(0);
  const rightTranslateY = useSharedValue(0);

  const swipeStart = useSharedValue(0);

  const {width, height} = Dimensions.get('window');
  const MAX_ROTATION = 60;
  const MAX_TRANSLATE_X = width * 0.6;
  const VOTE_THRESHOLD = -height * 0.2;

  const voteImage = (side: 'left' | 'right') => {
    console.log(`🔥 Voted: ${side} image!`);
  };

  const createImageGesture = (translateY: any, side: 'left' | 'right') =>
    Gesture.Pan()
      .onBegin(() => {
        swipeStart.value = translateX.value;
      })
      .onUpdate(e => {
        translateX.value = swipeStart.value + e.translationX;
        if (e.translationY < 0) {
          translateY.value = e.translationY;
        }
      })
      .onEnd(() => {
        if (translateX.value > width * 0.1) {
          translateX.value = withSpring(MAX_TRANSLATE_X, {
            stiffness: 100,
            damping: 100,
          });
        } else if (translateX.value < -width * 0.1) {
          translateX.value = withSpring(-MAX_TRANSLATE_X, {
            stiffness: 100,
            damping: 100,
          });
        } else {
          translateX.value = withSpring(0, {
            stiffness: 100, // Stiffness (higher value = faster)
            damping: 100, // Damping (higher value = less oscillation)
          });
        }

        if (translateY.value < VOTE_THRESHOLD) {
          runOnJS(voteImage)(side);
        }
        translateY.value = withSpring(0);
      });

  const leftImageGesture = createImageGesture(leftTranslateY, 'left');
  const rightImageGesture = createImageGesture(rightTranslateY, 'right');

  const leftImageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [-10, 320],
          Extrapolation.CLAMP,
        ),
      },
      {translateY: leftTranslateY.value},
      {
        rotateY: `${interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [MAX_ROTATION, 0],
          Extrapolation.CLAMP,
        )}deg`,
      },
    ],
  }));

  const rightImageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [-320, 10],
          Extrapolation.CLAMP,
        ),
      },
      {translateY: rightTranslateY.value},
      {
        rotateY: `${interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [0, -MAX_ROTATION],
          Extrapolation.CLAMP,
        )}deg`,
      },
    ],
  }));

  const voteImages = useSelector(
    (state: RootState) => state.voteImage.imageTupleList,
  );

  return (
    <SafeAreaView style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <View style={styles.container}>
        <GestureDetector gesture={leftImageGesture}>
          <Animated.Image
            source={{
              uri: 'https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-3_800x.jpg?v=1603744568',
            }}
            style={[styles.image, leftImageStyle]}
            resizeMode={'cover'}
          />
        </GestureDetector>

        <GestureDetector gesture={rightImageGesture}>
          <Animated.Image
            source={{
              uri: 'https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-3_800x.jpg?v=1603744568',
            }}
            style={[styles.image, rightImageStyle]}
            resizeMode={'cover'}
          />
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
};
