import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Popup from '../components/Popup';
import { iosColors, formatDateString, apiRoot } from '../util';
import DateTimePicker from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import useGlobalHook from '../store';
import isEqual from 'lodash/isEqual';

const EditTeacherScreen = () => {
  return (
    <View>
      <Text>edit teacher</Text>
    </View>
  );
}

const styles = StyleSheet.create({

  
});

export default EditTeacherScreen;