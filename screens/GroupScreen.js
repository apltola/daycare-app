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

export default GroupScreen = () => {
  return (
    <View>
      <Header title="juukeli" />
      <Text>GROUP SCREEN</Text>
      <Text>GROUP SCREEN</Text>
      <Text>GROUP SCREEN</Text>
      <Text>GROUP SCREEN</Text>
    </View>
  );
}

const styles = StyleSheet.create({

});