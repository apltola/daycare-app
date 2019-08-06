import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
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