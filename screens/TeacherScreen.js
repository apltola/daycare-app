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

const TeacherScreen = () => {
  return (
    <View>
      <Header title="ope" />
      <Text>TEACHER SCREEN</Text>
      <Text>TEACHER SCREEN</Text>
      <Text>TEACHER SCREEN</Text>
      <Text>TEACHER SCREEN</Text>
    </View>
  );
}

const styles = StyleSheet.create({

});

TeacherScreen.navigationOptions = ({ navigation }) => ({
  title: 'Ope'
})

export default TeacherScreen;