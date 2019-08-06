import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
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