import { StyleSheet } from 'react-native';
import { iosColors } from './index';

const globalStyles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingTop: 0,
    alignItems: 'flex-start',
  },
  input: {
    backgroundColor: '#e0e0e6',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default globalStyles;