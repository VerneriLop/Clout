import React from 'react';
import {Button, Dimensions, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {VoteStackParamList} from '../../navigation/Routes';
import {CompetitionInfo} from './CompetitionInfo';
import {VotePair} from './VotePair';

const {height} = Dimensions.get('window');

export const VoteScreen = () => {
  const navigation = useNavigation<StackNavigationProp<VoteStackParamList>>();

  return <VotePair />;
};
