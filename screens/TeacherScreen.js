import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
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