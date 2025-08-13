import {StyleSheet, Text, View} from 'react-native';

import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {BodyText, Title1Text, Title3Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {useGetCurrentCompetitionQuery} from '../../redux/api/endpoints/competitions';

export const CompetitionInfo = () => {
  const {colors} = useTheme();
  const {data: competitionData} = useGetCurrentCompetitionQuery('voting');

  return (
    <ThemedSafeAreaView style={styles.container}>
      <View style={[styles.upperBox]}>
        <Title1Text variant="heavy">
          {competitionData?.competition.category}
        </Title1Text>
      </View>
      <View style={[styles.infoBox, {backgroundColor: colors.card}]}>
        <BodyText style={{color: colors.textSecondary}}>
          {competitionData?.competition.description}
        </BodyText>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statsBox, {backgroundColor: colors.card}]}>
            <BodyText>
              Your vote count: {competitionData?.user_votes_count}
              {'\n'}
              All votes count: {competitionData?.all_votes_count}
              {'\n'}
              Number of competers: {competitionData?.competers_count}
            </BodyText>
          </View>
          <View style={[styles.dailyStreak, {backgroundColor: colors.card}]}>
            <Title3Text style={{color: colors.primary}}>Streak</Title3Text>
            <View style={styles.emojiAndNumber}>
              <Text style={{fontSize: 30}}>🔥</Text>
              <Title3Text>50</Title3Text>
            </View>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statsBox, {backgroundColor: colors.card}]}>
            <BodyText>
              Your vote count: {competitionData?.user_votes_count}
              {'\n'}
              All votes count: {competitionData?.all_votes_count}
              {'\n'}
              Number of competers: {competitionData?.competers_count}
            </BodyText>
          </View>
          <View style={[styles.statsBox, {backgroundColor: colors.card}]}>
            <BodyText>Current position</BodyText>
          </View>
        </View>
      </View>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {gap: 15, flex: 1},
  upperBox: {
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
  },
  infoBox: {
    marginHorizontal: 5,
    borderRadius: 5,
    padding: 5,
  },
  statsContainer: {flex: 1, gap: 15},
  statsRow: {
    marginHorizontal: 5,
    flex: 1,
    flexDirection: 'row',
    gap: 15,
  },
  statsBox: {
    flex: 1,
    borderRadius: 5,
    padding: 5,
  },
  dailyStreak: {
    flex: 1,
    borderRadius: 5,
    padding: 5,
    //justifyContent: 'center',
  },
  emojiAndNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
