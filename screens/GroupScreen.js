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

const GroupScreen = () => {
  return (
    <View>
      <Header title="Ryhmät" />
      <Text>GROUP SCREEN</Text>
      <Text>GROUP SCREEN</Text>
      <Text>GROUP SCREEN</Text>
      <Text>GROUP SCREEN</Text>
    </View>
  );
}

GroupScreen.navigationOptions = ({ navigation }) => ({
  title: 'Ryhmät'
})

const styles = StyleSheet.create({

});

export default GroupScreen