import React from 'react';
import {StyleSheet, View} from 'react-native';

import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {
  faCircleQuestion,
  faCommentDots,
  faMoon,
} from '@fortawesome/free-regular-svg-icons';
import {faCircleInfo, faGear} from '@fortawesome/free-solid-svg-icons';
import {ScrollView} from 'react-native-gesture-handler';

import {ThemedView} from '../../components/ui/themed-view';
import {Title3Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {
  SettingsCardItem,
  SettingsCardItemType,
} from './components/SettingsCardItem';

export const SettingsScreen = () => {
  const profileCardItems: SettingsCardItemType[] = [
    {icon: faGear, title: 'Account', contentType: 'account'},

    //{icon: faGear, title: 'Privacy'},
    //{icon: faGear, title: 'Notifications'},
  ];

  const generalCardItems: SettingsCardItemType[] = [
    {icon: faMoon, title: 'Dark mode', contentType: 'toggle'},
  ];

  const helpCardItems: SettingsCardItemType[] = [
    {icon: faCircleQuestion, title: 'Help'},
    {icon: faCommentDots, title: 'SendFeedback'},
    {icon: faCircleInfo, title: 'About'},
  ];

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <SettingsCard header={'Account'} itemTitleList={profileCardItems} />
        <SettingsCard header={'General'} itemTitleList={generalCardItems} />
        <SettingsCard
          header={'Help and policies'}
          itemTitleList={helpCardItems}
        />
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    marginHorizontal: 15,
    marginTop: 15,
  },
});

type SettingsCardType = {
  header: string;
  itemTitleList: SettingsCardItemType[];
};

const SettingsCard = ({header, itemTitleList}: SettingsCardType) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        stylesCard.container,
        {borderBottomColor: colors.border, backgroundColor: colors.card},
      ]}>
      <Title3Text variant="bold" style={stylesCard.headerTextContainer}>
        {header}
      </Title3Text>
      {itemTitleList.map((item, index) => (
        <SettingsCardItem
          icon={item.icon}
          title={item.title}
          contentType={item.contentType}
          isLastItem={index === itemTitleList.length - 1}
        />
      ))}
    </View>
  );
};

const stylesCard = StyleSheet.create({
  container: {
    paddingLeft: 10,
    borderRadius: 10,
  },
  headerTextContainer: {
    paddingVertical: 5,
  },
});
