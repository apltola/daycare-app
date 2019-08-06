import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: 'black',
    height: 64,
    marginBottom: 20
  },
  logo: {
    fontWeight: '600',
    fontSize: 17,
    paddingTop: 20
  },
});

export default Header;