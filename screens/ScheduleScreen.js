import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRoot } from '../util';
import useGlobalHook from '../store';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Animated
} from 'react-native';

import KidList from '../components/KidList';
import GoToScheduleButton from '../components/GoToScheduleButton';


export default ScheduleScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();


  return (
    <View style={styles.container}>
      <Animated.ScrollView style={styles.scrollView}>
        <KidList
          kids={globalState.allKids}
          buttonCb={kid => <GoToScheduleButton nav={navigation} kid={kid} /> }
        />
      </Animated.ScrollView>
    </View>
  );
}

ScheduleScreen.navigationOptions = ({navigation}) => ({
  title: 'Kalenteri'
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10,
  }
});