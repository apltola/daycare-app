import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
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

  const renderGroups = () => {

    const handleGroupDeleted = () => {

    }

    return postData.childgroups.map((group, idx) => {
      const padding = idx === 0 ? {paddingBottom: 10} : {paddingVertical: 10}

      return (
        <View style={[styles.groupListItem, padding]}>
          <View style={styles.groupListItem_left}>
            <Text style={styles.groupName}>
              {group.name}
            </Text>
          </View>
          <View style={styles.groupListItem_right}>
            <TouchableOpacity
              onPress={handleGroupDeleted}
              style={styles.groupDeleteButton}
            >
              <Icon
                name='minus'
                type='font-awesome'
                color='#f7f7f7'
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    })
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
            Ryhmät
          </Text>
          <View style={styles.groupList}>
            {renderGroups()}
          </View>
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
  groupListItem: {
    display: 'flex',
    flexDirection: 'row',
    //borderWidth: 1,
  },
  groupListItem_left: {
    flex: 1,
    //borderWidth: 1,
    justifyContent: 'center',
  },
  groupListItem_right: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
  },
  groupName: {
    fontSize: 16,
  },
  groupDeleteButton: {
    borderWidth: 1,
    borderColor: iosColors.red,
    backgroundColor: iosColors.red,
    height: 30,
    width: 30,
    borderRadius: 60,
    //display: 'flex',
    justifyContent: 'center',
  },
  deleteIcon: {
    color: 'white'
  }
});

export default EditTeacherScreen;