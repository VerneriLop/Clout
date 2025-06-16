import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {
  faCircleQuestion,
  faCommentDots,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightFromBracket,
  faCircleInfo,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {ThemedView} from '../../components/ui/themed-view';
import {
  BodyText,
  HeadlineText,
  ThemedIcon,
  Title2Text,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';

export const SettingsScreen = () => {
  const titleList1 = [
    {icon: faGear, title: 'General'},
    //{icon: faGear, title: 'Privacy'},
    //{icon: faGear, title: 'Notifications'},
  ];

  const titleList2 = [
    {icon: faCircleQuestion, title: 'Help'},
    {icon: faCommentDots, title: 'Send feedback'},
    {icon: faCircleInfo, title: 'About'},
  ];

  const titleList3 = [{icon: faArrowRightFromBracket, title: 'Logout'}];

  return (
    <ThemedView style={styles.container}>
      <SettingsCard header={'Account'} itemTitleList={titleList1} />
      <SettingsCard header={'Help and policies'} itemTitleList={titleList2} />
      <SettingsCard header={'Login'} itemTitleList={titleList3} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type SettingsCardItemType = {
  icon: IconDefinition;
  title: string;
};

const SettingsCardItem = ({icon, title}: SettingsCardItemType) => {
  const {colors} = useTheme();
  return (
    <View style={stylesItems.container}>
      <ThemedIcon
        icon={icon}
        color={title === 'Logout' ? colors.warning : undefined}
      />
      <HeadlineText style={title === 'Logout' && {color: colors.warning}}>
        {title}
      </HeadlineText>
    </View>
  );
};

const stylesItems = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20,
  },
});

type SettingsCardType = {
  header: string;
  itemTitleList: {icon: IconDefinition; title: string}[];
};

const SettingsCard = ({header, itemTitleList}: SettingsCardType) => {
  const {colors} = useTheme();

  return (
    <View style={[stylesCard.container, {borderBottomColor: colors.border}]}>
      <Title2Text variant="bold">{header}</Title2Text>
      {itemTitleList.map(item => (
        <SettingsCardItem icon={item.icon} title={item.title} />
      ))}
    </View>
  );
};

const stylesCard = StyleSheet.create({
  container: {
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
