import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { iosColors } from '../util';

const Button = props => {

  const getButtonStyle = elementType => {
    if (elementType === 'button') {
      switch(props.style) {
        case 'primary':
          return [styles.btn, styles.btn_primary];

        case 'delete':
          return [sytles.btn, styles.btn_delete];
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled || false}
      style={getButtonStyle('button')}
    >
      <Text style={styles.btn_text}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 55,
    paddingRight: 55,
  },
  btn_primary: {
    borderColor: iosColors.darkGreen,
    backgroundColor: iosColors.darkGreen,
  },
  btn_delete: {
    borderColor: iosColors.red,
    backgroundColor: iosColors.red,
  },
  btn_text: {
    textTransform: 'uppercase',
    color: 'white',
    fontWeight: 'bold',
  }
});

export default Button;