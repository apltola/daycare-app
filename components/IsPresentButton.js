import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TouchableHighlight, Animated } from 'react-native';

const IsPresentButton = props => {

  const setKidPresent = kid => {
    try {
      console.log(kid.firstName);
    } catch(err) {
      console.err(err);
    }
  }

  return (
    <TouchableOpacity
      style={styles.presentBtn}
      onPress={() => setKidPresent(props.kid)}
    >
      <Text style={styles.presentBtnText}>
        Paikalla
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  presentBtn: {
    borderColor: 'black',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 3
  }
});

export default IsPresentButton;