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
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    paddingTop: 40,
    paddingBottom: 10,
    marginBottom: 20
  },
  logo: {
    //textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
});

//export { Header };
export default Header;