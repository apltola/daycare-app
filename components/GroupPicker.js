import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TextInput, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { iosColors } from '../util';
import useGlobalHook from '../store';

const GroupPicker = ({value, items, handleGroupPicked}) => {

  return (
    <RNPickerSelect
      placeholder={{
        label: 'Valitse ryhmä',
        value: null,
        color: iosColors.grey,
      }}
      value={value}
      onValueChange={value => handleGroupPicked(value)}
      style={pickerStyles}
      items={items}
      doneText='Valmis'
    />
  );
}

// https://snack.expo.io/@lfkwtz/react-native-picker-select
const pickerStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#e0e0e6',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: iosColors.black,
  },
  inputAndroid: {
    backgroundColor: '#e0e0e6',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: iosColors.black,
  },
})

export default GroupPicker;