import {StyleSheet} from 'react-native';
import {description, screenBackground} from './colors';

export const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: screenBackground,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paddingHorizontal16: {
    paddingHorizontal: 16,
  },
  paddingVertical8: {
    paddingVertical: 8,
  },
  marginStart16: {
    marginStart: 16,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: description,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
});
