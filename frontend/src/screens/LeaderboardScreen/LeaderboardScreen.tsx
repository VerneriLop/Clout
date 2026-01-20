import React, {useEffect, useState} from 'react';
import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import {Pressable} from 'react-native';

import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import {Image} from 'expo-image';

import globalStyle from '../../assets/styles/globalStyle';
import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {
  FootnoteText,
  HeadlineText,
  LargeTitleText,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {
  LeaderboardEntryType,
  useGetFinishedCompetitionsQuery,
  useGetLeaderboardQuery,
} from '../../redux/api/endpoints/competitions';
import style from '../LoginScreen/style';
import {LeaderboardItem} from './LeaderboardItem';
import {LeaderboardModal} from './LeaderboardModal';

const LEADERBOARD_OFFSET = 4; // on which index lb starts

export const LeaderboardScreen = () => {
  const {colors} = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  useEffect(() => console.log(selectedImage), []);

  const {
    data: finishedCompetitions,
    isLoading: isLoadingComps,
    isError: isErrorComps,
  } = useGetFinishedCompetitionsQuery();

  const firstCompId = finishedCompetitions?.data?.[0]?.id;

  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    isError: isErrorLeaderboard,
    error: leaderboardError,
  } = useGetLeaderboardQuery(firstCompId ?? skipToken);

  if (isLoadingComps || (firstCompId && isLoadingLeaderboard)) {
    return <Spinner />;
  }

  if (isErrorComps || isErrorLeaderboard) {
    return (
      <View>
        <Title3Text>Error loading data. Please try again.</Title3Text>
      </View>
    );
  }

  if (!finishedCompetitions?.data || finishedCompetitions.data.length === 0) {
    return (
      <View>
        <Title3Text>No competitions found.</Title3Text>
      </View>
    );
  }

  if (!leaderboard) {
    return (
      <View>
        <Title3Text>Leaderboard currently unavailable.</Title3Text>
      </View>
    );
  }

  const leaderboardData =
    leaderboard.leaderboard.slice(LEADERBOARD_OFFSET - 1) ?? [];

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
        onImagePress={url => setSelectedImage(url)}
      />
    );
  };

  const podiumData = leaderboard?.leaderboard.slice(0, 3) ?? [];

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedSafeAreaView style={[globalStyle.flex, {}]}>
      <LargeTitleText variant="heavy">
        {leaderboard?.competition.category}
      </LargeTitleText>

      <FlashList
        data={leaderboardData}
        ListHeaderComponent={<PodiumView podiumData={podiumData} />}
        renderItem={renderItem}
      />

      <LeaderboardModal
        onRequestClose={() => setSelectedImage(null)}
        selectedImage={selectedImage}
      />
    </ThemedSafeAreaView>
  );
};

type PodiumViewProps = {
  podiumData: LeaderboardEntryType[];
};

const PodiumView = ({podiumData}: PodiumViewProps) => {
  const firstPlace = podiumData[0];
  const secondPlace = podiumData[1];
  const thirdPlace = podiumData[2];

  return (
    <View style={styles.podiumColumnContainer}>
      <View style={styles.winnerContainer}>
        <Image
          source={{
            uri: firstPlace.image_url,
          }}
          style={styles.winnerImage}
        />
        <HeadlineText>1. {firstPlace.username}</HeadlineText>
      </View>
      <View style={styles.podiumRowContainer}>
        <View style={styles.winnerContainer}>
          <Image
            source={{
              uri: secondPlace.image_url,
            }}
            style={styles.secondAndThirdPlaceImage}
          />
          <HeadlineText>2. {secondPlace.username}</HeadlineText>
        </View>

        <View style={styles.winnerContainer}>
          <Image
            source={{
              uri: thirdPlace.image_url,
            }}
            style={styles.secondAndThirdPlaceImage}
          />
          <HeadlineText>3. {thirdPlace.username}</HeadlineText>
        </View>
      </View>
    </View>
  );
};

const {width} = Dimensions.get('window');
const WINNER_IMAGE_WIDTH = width * 0.5;
const WINNER_IMAGE_HEIGHT = (WINNER_IMAGE_WIDTH / 3) * 4;
const PODIUM_IMAGE_WIDTH = width * 0.25;
const PODIUM_IMAGE_HEIGHT = (PODIUM_IMAGE_WIDTH / 3) * 4;

const styles = StyleSheet.create({
  podiumColumnContainer: {
    //backgroundColor: 'red',
    flexDirection: 'column',
    flex: 1,
    marginTop: 10,
    gap: 20,
    marginBottom: 24,
  },
  podiumRowContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  winnerContainer: {alignItems: 'center'},
  winnerImage: {
    width: WINNER_IMAGE_WIDTH,
    height: WINNER_IMAGE_HEIGHT,
    borderRadius: 5,
  },
  secondAndThirdPlaceImage: {
    width: PODIUM_IMAGE_WIDTH,
    height: PODIUM_IMAGE_HEIGHT,
    borderRadius: 5,
  },
});
