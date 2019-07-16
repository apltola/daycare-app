import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import KidListScreen from './screens/KidListScreen';
import Header from './components/Header';

export default function App() {
  return (
    <View style={styles.container}>
      <Header title="childMinder_3000" />
      <KidListScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //paddingTop: 50
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
