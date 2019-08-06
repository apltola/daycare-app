import React, { useState, useEffect } from 'react';
import useGlobalHook from '../store';
import {
  StyleSheet,
  View,
  Animated
} from 'react-native';

import KidList from '../components/KidList';
import GoToScheduleButton from '../components/GoToScheduleButton';


export default ScheduleScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();


  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: 20}}
        style={styles.scrollView}>
        <KidList
          kids={globalState.allKids}
          buttonRenderer={kid => <GoToScheduleButton nav={navigation} kid={kid} /> }
        />
      </Animated.ScrollView>
    </View>
  );
}

ScheduleScreen.navigationOptions = ({navigation}) => ({
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
  }
});