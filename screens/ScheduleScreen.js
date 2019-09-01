import React, { useState, useEffect } from 'react';
import useGlobalHook from '../store';
import { StyleSheet, View, Text, Animated } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { iosColors } from '../util';


export default ScheduleScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();


  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: 20}}
        style={styles.scrollView}
      >

        <View style={styles.title}>
          <Text style={styles.title_text}>
            Valitse muksun kalenterinäkymä
          </Text>
        </View>

        <View style={styles.listContainer}>
          {globalState.allKids.map(kid => {
            return (
              <View style={styles.kidItem}>
                <TouchableOpacity
                  style={styles.kidButton}
                  onPress={() => navigation.navigate('calendar', {
                    kid: kid
                  })}
                >
                  <Text style={styles.kidButton_text}>
                    {kid.firstName}, {kid.childgroup.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

      </Animated.ScrollView>
    </View>
  );
}

ScheduleScreen.navigationOptions = () => ({
  title: 'Aikataulut',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10,
    //paddingTop: 10
  },
  title_text: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingTop: 20,
  },
  kidItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  kidButton: {
    //borderWidth: 1,
    marginBottom: 10,
  },
  kidButton_text: {
    color: iosColors.darkBlue,
    fontSize: 20,

  }
});