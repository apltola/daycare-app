import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { iosColors } from '../util';

const Header = ({ title, noMargin = false }) => {
  const wrapperStyle = {
    marginBottom: noMargin ? 0 : 20
  }
  
  return (
    <View style={wrapperStyle}>
      <View style={{height: 20, backgroundColor: '#fafafa'}} />
      <View style={styles.header}>
        <Text style={styles.logo}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: iosColors.black,
    height: 50,
    backgroundColor: '#fafafa'
  },
  logo: {
    fontWeight: '600',
    fontSize: 17,
  },
});

export default Header;