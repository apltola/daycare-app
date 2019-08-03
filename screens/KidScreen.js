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
import Header from '../components/Header';

const KidScreen = () => {
  return (
    <View>
      <Header title="Muksu" />
      <Text>KID SCREEN</Text>
      <Text>KID SCREEN</Text>
      <Text>KID SCREEN</Text>
      <Text>KID SCREEN</Text>
    </View>
  );
}

KidScreen.navigationOptions = ({ navigation }) => ({
  title: 'Muksu'
});

const styles = StyleSheet.create({

});

export default KidScreen;