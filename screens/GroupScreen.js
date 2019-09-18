import React, { useState } from 'react';
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
      <Text>TO BE DONE</Text>
    </View>
  );
}

GroupScreen.navigationOptions = ({ navigation }) => ({
  title: 'Ryhmät'
})

const styles = StyleSheet.create({

});

export default GroupScreen