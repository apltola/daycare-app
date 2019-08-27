import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

const Spinner = ({ size }) => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={size || 'large'} color="#0070f3" />
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerStyle: {
    margin: 10
  }
});

export default Spinner;