import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {Title1Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {useGetCurrentCompetitionQuery} from '../../redux/api/endpoints/competitions';
import {InfoBox} from './InfoBox';

export const CompetitionInfo = () => {
  const {data: competitionData} = useGetCurrentCompetitionQuery('voting');

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const midnightUTC = new Date(now);
    midnightUTC.setUTCHours(24, 0, 0, 0);

    const diff = midnightUTC.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedSafeAreaView style={styles.container}>
      <View style={[styles.upperBox]}>
        <Title1Text variant="heavy">
          {competitionData?.competition.category}
        </Title1Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.mainInfo}>
          <InfoBox
            title={'Info'}
            icon={''}
            mainInfo={competitionData?.competition.description}
            footerText={'Sponsored by Clout'}
            aspectRatio={2 / 1}
            size="body"
          />
        </View>
        <View style={styles.statsRow}>
          <InfoBox
            title={'Votes'}
            icon={''}
            mainInfo={'50'}
            footerText={`All votes: ${competitionData?.all_votes_count}`}
            aspectRatio={1}
          />
          <InfoBox
            title={'Streak'}
            icon={''}
            mainInfo={'50'}
            footerText={'You have blaa blaa blaa'}
            aspectRatio={1}
          />
        </View>
        <View style={styles.statsRow}>
          <InfoBox
            title={'Time left'}
            icon={''}
            mainInfo={timeLeft}
            footerText={'Time left for this competition'}
            aspectRatio={1}
          />
          <InfoBox
            title={'Current position'}
            icon={''}
            mainInfo={9}
            footerText={'Your current position in this competition'}
            aspectRatio={1}
          />
        </View>
      </View>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {gap: 15, flex: 1, marginHorizontal: 5},
  upperBox: {
    borderRadius: 5,
    justifyContent: 'center',
  },
  statsContainer: {flex: 1, gap: 15},
  mainInfo: {flex: 1},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
});
