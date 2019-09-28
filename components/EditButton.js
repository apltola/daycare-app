import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { iosColors } from '../util';

const EditButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.editButton}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Icon
          name="edit"
          type="font-awesome"
          color={iosColors.grey}
          size={30}
        />
        <Text style={styles.buttonText}>MUOKKAA</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  editButton: {
    //borderWidth: 1,
    padding: 0,
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: iosColors.grey,
    fontWeight: 'bold',
  }
});

export default EditButton;