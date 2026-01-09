import {StyleSheet, Text, View} from 'react-native';

import {BodyText, Title3Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';

type InfoBoxProps = {
  title: string;
  icon: any;
  mainInfo: string | number | undefined;
  footerText: string;
  aspectRatio: number;
  size?: 'body' | 'title';
};

export const InfoBox = ({
  title,
  icon,
  mainInfo,
  footerText,
  aspectRatio,
  size = 'title',
}: InfoBoxProps) => {
  const {colors} = useTheme();

  const MainInfo = size === 'title' ? Title3Text : BodyText;

  return (
    <View
      style={[
        styles.dailyStreak,
        {backgroundColor: colors.card, aspectRatio: aspectRatio},
      ]}>
      <Title3Text style={{color: colors.primary}}>{title}</Title3Text>
      <View style={styles.emojiAndText}>
        <Text style={{fontSize: 30}}>🔥 {icon}</Text>
        <MainInfo>{mainInfo}</MainInfo>
      </View>
      <BodyText>{footerText}</BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  dailyStreak: {
    borderRadius: 20,
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
    maxWidth: '100%',
  },
  emojiAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    //backgroundColor: 'tomato',
  },
});
