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
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    height: 70,
    marginBottom: 20
    //paddingTop: 40,
    //paddingBottom: 10,
    //marginBottom: 20
  },
  logo: {
    //textAlign: 'center',
    fontWeight: '600',
    fontSize: 17,
    paddingTop: 20
  },
});

//export { Header };
export default Header;