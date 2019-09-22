import { StyleSheet } from 'react-native';
import { iosColors } from './index';

const globalStyles = StyleSheet.create({
  button_primary: {
    borderWidth: 1,
    borderColor: iosColors.darkGreen,
    backgroundColor: iosColors.darkGreen,
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 55,
    paddingRight: 55,
  },
  button_primary_text: {
    textTransform: 'uppercase',
    color: 'white',
    fontWeight: 'bold',
  }
});

export default globalStyles;