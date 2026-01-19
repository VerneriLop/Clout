import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import {Image} from 'expo-image';
import Toast from 'react-native-toast-message';

import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView, ThemedView} from '../../components/ui/themed-view';
import {
  HeadlineText,
  LargeTitleText,
  ThemedText,
} from '../../components/ui/typography';
import {
  useGetFinishedCompetitionsQuery,
  useGetLeaderboardQuery,
} from '../../redux/api/endpoints/competitions';

// adjust if needed

export const LeaderboardScreen = () => {
  useFocusEffect(
    useCallback(() => {
      Toast.show({
        type: 'success',
        text1: 'Leaderboard Screen Opened!',
      });
    }, []),
  );

  const {data: finishedCompetitions} = useGetFinishedCompetitionsQuery();

  console.log('kisat jotka loppunu:', finishedCompetitions);
  const mockId = finishedCompetitions?.data[0].id;

  const {data, error} = useGetLeaderboardQuery(mockId ? mockId : skipToken);
  console.log('Leaderboard data: ', data, error);
  //const leaderboardData = [];
  const renderItem = useCallback(() => <LeaderboardItem />, []);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedSafeAreaView style={[globalStyle.flex, {}]}>
      <LargeTitleText variant="heavy">
        {data?.competition.category}
      </LargeTitleText>
      <HeadlineText>{data?.competition.description}</HeadlineText>

      <Image
        style={{width: 256, height: 512}}
        source={data?.leaderboard[0].image_url}
      />

      <View
        style={{
          backgroundColor: 'gray',
          flex: 1,
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          marginTop: 64,
        }}></View>

      {/*<FlashList
        data={[leaderboardData]}
        ListHeaderComponent={<PodiumView />}
        renderItem={renderItem}
      />*/}
    </ThemedSafeAreaView>
  );
};

type PodiumViewProps = {};

const PodiumView = () => {
  return (
    <View style={styles.podiumContainer}>
      <Image
        source={{
          uri: 'https://picsum.photos/seed/9cf2603f-852c-5321-a393-5c9885083598_post_2/400/300',
        }}
      />
      <Image
        source={{
          uri: 'https://picsum.photos/seed/9cf2603f-852c-5321-a393-5c9885083598_post_2/400/300',
        }}
      />
      <Image
        source={{
          uri: 'https://picsum.photos/seed/9cf2603f-852c-5321-a393-5c9885083598_post_2/400/300',
        }}
      />
    </View>
  );
};

type LeaderBoardProps = {};

const LeaderboardItem = () => {
  return <></>;
};

const styles = StyleSheet.create({
  leaderboardItemContainer: {},
  podiumContainer: {
    flexDirection: 'row',
    flex: 1,
  },
});
