import {ScrollView} from 'react-native';

import {CompetitionInfo} from './CompetitionInfo';
import {VotePair} from './VotePair';

export const VoteScreen = () => {
  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{
        flex: 1,
      }}>
      <CompetitionInfo />
      <VotePair />
    </ScrollView>
  );
};
