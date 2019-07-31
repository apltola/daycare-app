import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TouchableHighlight, Animated } from 'react-native';

const KidList = ({ kids, buttonCb }) => {

  return kids.map(kid => {
    return (
      <View key={kid.id} style={styles.kidItem}>
        <View style={styles.kidItemLeft}>
          <Text style={styles.kidName}>{kid.firstName}</Text>
          {/* <Text>{kid.childGroup.name}</Text> */}
        </View>
        <View style={styles.kidItemRight}>
          {buttonCb(kid)}
        </View>
      </View>
    );
  })
}

const styles = StyleSheet.create({
  kidItem: {
    flexDirection: 'row',
    padding: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#d1d5da',
  },
  kidItemLeft: {
    flex: 1,
  },
  kidItemRight: {
    flex: 1,
    //borderWidth: 1,
    //borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  kidName: {
    fontSize: 25,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 10,
    //borderWidth: 1,
    //borderColor: 'black'
  },
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

export default KidList;