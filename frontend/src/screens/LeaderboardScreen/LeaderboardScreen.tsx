import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import {Image} from 'expo-image';

import globalStyle from '../../assets/styles/globalStyle';
import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {
  HeadlineText,
  LargeTitleText,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {LeaderboardStackParamList, Routes} from '../../navigation/Routes';
import {
  LeaderboardEntryType,
  useGetFinishedCompetitionsQuery,
  useGetLeaderboardQuery,
} from '../../redux/api/endpoints/competitions';
import {PodiumView} from './PodiumView';

const LEADERBOARD_OFFSET = 4; // on which index lb starts

export const LeaderboardScreen = () => {
  const {colors} = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<LeaderboardStackParamList>>();
  /*
    useFocusEffect(
    useCallback(() => {
      Toast.show({
        type: 'success',
        text1: 'Leaderboard Screen Opened!',
      });
    }, []),
  );
*/

  const {data: finishedCompetitions} = useGetFinishedCompetitionsQuery();

  const mockId = finishedCompetitions?.data[0].id;

  const {data, error} = useGetLeaderboardQuery(mockId ? mockId : skipToken);
  console.log('Leaderboard data: ', data, error);

  const leaderboardData = data?.leaderboard.slice(LEADERBOARD_OFFSET - 1) ?? []; // omit top 3
  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntryType;
    index: number;
  }) => {
    return (
      <LeaderboardItem
        data={item}
        index={index + LEADERBOARD_OFFSET}
        handleNavigate={handleNavigate}
      />
    );
  };

  const podiumData = data?.leaderboard.slice(0, 3) ?? [];

  const handleNavigate = (username: string) => {
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {username: username},
    });
  };

  if (mockId === undefined || !data) {
    return (
      <View>
        <Title3Text>No competition found.</Title3Text>
      </View>
    );
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedSafeAreaView style={[globalStyle.flex, {}]}>
      <LargeTitleText variant="heavy">
        {data?.competition.category}
      </LargeTitleText>

      <FlashList
        data={leaderboardData}
        ListHeaderComponent={
          <PodiumView podiumData={podiumData} handleNavigate={handleNavigate} />
        }
        renderItem={renderItem}
      />

      {/*<View
        style={{
          backgroundColor: colors.card,
          flex: 1,
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          marginTop: 64,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}></View> */}
    </ThemedSafeAreaView>
  );
};

type LeaderBoardItemProps = {
  data: LeaderboardEntryType;
  index: number;
  handleNavigate: (username: string) => void;
};

const LeaderboardItem = ({
  data,
  index,
  handleNavigate,
}: LeaderBoardItemProps) => {
  const {colors} = useTheme();
  return (
    <View
      style={[styles.leaderboardItemContainer, {backgroundColor: colors.card}]}>
      <View style={{flexDirection: 'row', gap: 16}}>
        <Title3Text variant="heavy">{index.toString()}.</Title3Text>
        <OpacityPressable onPress={() => handleNavigate(data.username)}>
          <HeadlineText variant="medium">{data.username}</HeadlineText>
        </OpacityPressable>
      </View>
      <Image style={styles.itemImage} source={data.image_url} />
    </View>
  );
};

const styles = StyleSheet.create({
  leaderboardItemContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    marginVertical: 3,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    margin: 6,
    borderRadius: 9,
  },
});
