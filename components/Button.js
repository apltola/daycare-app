import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { iosColors } from '../util';

const Button = props => {

  const getButtonStyle = elementType => {
    if (elementType === 'button') {
      switch(props.style) {
        case 'green':
          return [
            styles.btn,
            styles.btn_primary,
            props.disabled ? styles.btn_disabled : null
          ];

        case 'red':
          return [
            styles.btn,
            styles.btn_delete,
            props.disabled ? styles.btn_disabled : null
          ];
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
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
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    //paddingLeft: 55,
    //paddingRight: 55,
    width: 250,
    display: 'flex',
    alignItems: 'center',
  },
  btn_disabled: {
    opacity: 0.3
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