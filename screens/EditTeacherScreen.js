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
import globalStyles from '../util/globalStyles';
import GroupPicker from '../components/GroupPicker';

const EditTeacherScreen = ({ navigation }) => {
  const teacher = navigation.getParam('teacher', {
    name: '',
    childgroups: []
  });
  const clearSearchTerm = navigation.getParam('clearSearchTerm');
  const addNewTeacher = navigation.getParam('addNewTeacher', false);

  const [globalState, globalActions] = useGlobalHook();
  const [postData, setPostData] = useState(teacher);
  const [res, setRes] = useState({});

  const handleGroupPicked = group => {
    if (!group) {
      return;
    }
    const idx = globalState.childGroups.findIndex(i => i.id === group);
    setPostData(() => ({...postData, childgroup: globalState.childGroups[idx]}));
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{padding: 20}}
      >
        <Text>
          {addNewTeacher ? 'Lisää uusi ope' : `Muokkaa opea ${teacher.name}`}
        </Text>
        <View style={styles.section}>
          <Text style={styles.label}>
            Nimi
          </Text>
          <TextInput
            style={globalStyles.input}
            value={postData.name}
            onChangeText={text => setPostData({...postData, name: text})}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Ryhmä
          </Text>
          {/* <GroupPicker value={} items={} handleGroupPicked={} /> */}
        </View>

        <View style={{marginTop: 60}}>
          <Text>
            teacher: {JSON.stringify(teacher || {}, null, 2)}
          </Text>
          <Text>
            postData: {JSON.stringify(postData || {}, null, 2)}
          </Text>
          <Text>
            res: {JSON.stringify(res || {}, null, 2)}
          </Text>
          <Text>
            global.groups: {JSON.stringify(globalState.childGroups || {}, null, 2)}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: iosColors.black,
  },
});

export default EditTeacherScreen;