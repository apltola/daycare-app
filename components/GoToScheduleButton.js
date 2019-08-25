import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TouchableHighlight, Animated } from 'react-native';

const GoToScheduleButton = props => {

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => props.nav.navigate('calendar', {
        kid: props.kid
      })}
    >
      <Text>
        Avaa kalenteri
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderColor: 'black',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 3
  }
});

export default GoToScheduleButton;