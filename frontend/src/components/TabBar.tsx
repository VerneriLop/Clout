import {useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {useTheme} from '../hooks/useTheme';
import {OpacityPressable} from './OpacityPressable/OpacityPressable';
import {BodyText} from './ui/typography';

export const TabBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {colors} = useTheme();
  const translateX = useSharedValue(0);
  const layout = useWindowDimensions();
  //const layoutWidth = useSharedValue(layout.width);

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    translateX.value = index * layout.width;
    //scrollRef.current?.scrollTo({x: index * layout.width, animated: true});
  };

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateX.value / 2, {
          duration: 200,
        }),
      },
    ],
  }));

  return (
    <View
      style={[
        styles.tabBar,
        {backgroundColor: colors.card, borderBottomColor: colors.text},
      ]}>
      <OpacityPressable style={[styles.tab]} onPress={() => handleTabPress(0)}>
        <BodyText style={activeIndex !== 0 && {color: colors.textSecondary}}>
          Posts
        </BodyText>
      </OpacityPressable>
      <OpacityPressable style={[styles.tab]} onPress={() => handleTabPress(1)}>
        <BodyText style={activeIndex !== 1 && {color: colors.textSecondary}}>
          Statistics
        </BodyText>
      </OpacityPressable>
      <Animated.View
        style={[
          styles.underline,
          underlineStyle,
          {backgroundColor: colors.text},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    //justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    //borderBottomColor: '#ddd',
    position: 'relative',
    //backgroundColor: 'blue',
  },
  tab: {flex: 1, paddingVertical: 10, alignItems: 'center'},
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '50%',
    //backgroundColor: 'white',
  },
});
