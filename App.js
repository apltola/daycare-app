import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import KidListScreen from './screens/KidListScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <KidListScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
