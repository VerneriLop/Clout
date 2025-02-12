import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../assets/styles/scaling';

const style = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  input: {
    marginBottom: verticalScale(20),
  },
  registerLink: {
    color: 'blue',
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
});

export default style;
