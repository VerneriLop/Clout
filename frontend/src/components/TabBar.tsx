import {useCallback, useRef, useState} from 'react';
import {
  RefreshControlProps,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import {FlashList} from '@shopify/flash-list';
import {
  Gesture,
  GestureDetector,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  FadingTransition,
  Layout,
  LinearTransition,
  SharedValue,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {createAnimatedComponent} from 'react-native-reanimated/lib/typescript/createAnimatedComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useTheme} from '../hooks/useTheme';
import {OpacityPressable} from './OpacityPressable/OpacityPressable';
import {BodyText} from './ui/typography';

import {PostType} from '../types/types';

const routes = [
  {key: 'posts', title: 'Posts'},
  {key: 'stats', title: 'Statistics'},
];

type TabBarProps = {
  renderPosts: () => React.ReactNode;
  renderStats: () => React.ReactNode;
  renderHeader: () => React.ReactNode;
  renderRefreshControl: () =>
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
  scrollY: SharedValue<number>;
};

export const TabBar = ({
  renderPosts,
  renderStats,
  renderHeader,
  renderRefreshControl,
  scrollY,
}: TabBarProps) => {
  const [activeIndex, setActiveIndex] = useState(0); //useState(new Set([0]));
  //const [renderedTabs, setRenderedTabs] = useState<Set<number>>(new Set([0]));

  const {colors} = useTheme();
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const sharedActiveIndex = useSharedValue(0);
  const offset = useSharedValue(0);

  const handleTabPress = (index: number) => {
    /*if (!activeIndex.has(index)) {
      setActiveIndex(prev => new Set([...prev, index]));
    }*/
    setActiveIndex(index);
    sharedActiveIndex.value = index;
    offset.value = withSpring(-layout.width * index, {damping: 30});
  };

  const underlineStyle = useAnimatedStyle(() => {
    const translationX = interpolate(
      offset.value,
      [0, -layout.width],
      [0, layout.width / 2],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        {
          translateX: translationX,
        },
      ],
    };
  });

  const postsRouteStyle = useAnimatedStyle(() => {
    const color =
      sharedActiveIndex.value == 0 ? colors.text : colors.textSecondary;
    return {color: withTiming(color, {duration: 300})};
  });

  const statsRouteStyle = useAnimatedStyle(() => {
    const color =
      sharedActiveIndex.value == 1 ? colors.text : colors.textSecondary;
    return {color: withTiming(color, {duration: 300})};
  });

  const AnimatedBodyText = Animated.createAnimatedComponent(BodyText);

  const pan = Gesture.Pan()
    .onUpdate(event => {
      offset.value =
        -sharedActiveIndex.value * layout.width + event.translationX;
    })
    .onEnd(event => {
      const nextIndex =
        event.velocityX < -500 || event.translationX < -layout.width / 2
          ? 1
          : event.velocityX > 500 || event.translationX > layout.width / 2
            ? 0
            : sharedActiveIndex.value;

      sharedActiveIndex.value = nextIndex;
      offset.value = withSpring(-layout.width * nextIndex, {damping: 30});
    });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, layout.height / 2],
            [0, -layout.height / 2],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const containerPanStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  return (
    <ScrollView
      style={{}}
      stickyHeaderIndices={[1]}
      nestedScrollEnabled
      refreshControl={renderRefreshControl()}>
      {renderHeader()}
      <Animated.View
        style={[
          headerAnimatedStyle,
          {
            //position: 'absolute',
            //top: insets.top,
            //zIndex: 1,
            //height: layout.height / 2 - insets.top - insets.bottom,
            //backgroundColor: 'tomato',
            //pointerEvents: 'box-none',
          },
        ]}>
        <View
          style={[
            styles.tabBar,
            {backgroundColor: colors.card, borderBottomColor: colors.text},
          ]}>
          <OpacityPressable
            style={[styles.tab]}
            onPress={() => handleTabPress(0)}>
            <AnimatedBodyText style={postsRouteStyle}>Posts</AnimatedBodyText>
          </OpacityPressable>
          <OpacityPressable
            style={[styles.tab]}
            onPress={() => handleTabPress(1)}>
            <AnimatedBodyText style={statsRouteStyle}>
              Statistics
            </AnimatedBodyText>
          </OpacityPressable>
          <Animated.View
            style={[
              styles.underline,
              underlineStyle,
              {backgroundColor: colors.text},
            ]}
          />
        </View>
      </Animated.View>
      <Animated.View
        style={[
          {
            flex: 1,
            flexDirection: 'row',
            width: layout.width * 2,
          },
        ]}
        layout={LinearTransition}>
        <Animated.View
          style={[
            {
              width: layout.width,
              flex: 1,
              zIndex: 2,
              pointerEvents: 'box-none',
            },
            containerPanStyle,
          ]}
          key="posts">
          {renderPosts()}
        </Animated.View>

        <Animated.View
          style={{
            width: layout.width,
            flex: 1,
            backgroundColor: 'rgb(182, 24, 222)',
          }}
          key="stats">
          {renderStats()}
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {flex: 1, alignItems: 'center', justifyContent: 'center', height: 40},
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '50%',
  },
});
