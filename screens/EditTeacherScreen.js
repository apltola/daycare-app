import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Popup from '../components/Popup';
import { iosColors, formatDateString, apiRoot, customColors } from '../util';
import DateTimePicker from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import useGlobalHook from '../store';
import isEqual from 'lodash/isEqual';
import globalStyles from '../util/globalStyles';
import GroupPicker from '../components/GroupPicker';

function EditTeacherScreen({ navigation }) {
  const teacher = navigation.getParam('teacher', {
    name: '',
    childgroups: []
  });
  const clearSearchTerm = navigation.getParam('clearSearchTerm');
  const addNewTeacher = navigation.getParam('addNewTeacher', false);

  const [globalState, globalActions] = useGlobalHook();
  const [postData, setPostData] = useState(teacher);
  const [res, setRes] = useState({});

  const handleGroupToggled = (group, addGroup) => {
    let groups = [];
    if (addGroup) {
      groups = [...postData.childgroups, group];
    } else {
      groups = postData.childgroups.filter(i => i.id !== group.id);
    }

    return setPostData({...postData, childgroups: groups});
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{padding: 20}}
      >
        <Text style={{fontSize: 16}}>
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
            {
              globalState.childGroups.map((group, idx) => {
                const groupSelected = postData.childgroups.findIndex(i => i.id === group.id) > -1;

                return (
                  <View style={[styles.groupListItem, {borderTopWidth: idx === 0 ? 1 : 0}]}>
                    <View style={styles.groupListItem_left}>
                      <Text style={[styles.groupName, {
                        opacity: groupSelected ? 1 : 0.4
                      }]}>
                        {group.name}
                      </Text>
                    </View>
                    <View style={styles.groupListItem_right}>
                      <TouchableOpacity
                        onPress={() => handleGroupToggled(group, !groupSelected)}
                        style={[styles.toggleGroupButton,{
                          backgroundColor: groupSelected ? iosColors.darkGreen : customColors.grey,
                          borderColor: groupSelected ? iosColors.darkGreen : customColors.grey
                        }]}
                      >
                        <Icon
                          name='check'
                          type='font-awesome'
                          color='#ffffff'
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            }
          </View>
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
          {/* <Text>
            global.groups: {JSON.stringify(globalState.childGroups || {}, null, 2)}
          </Text> */}
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
    paddingVertical: 10,
    flexDirection: 'row',
    //borderWidth: 1,
    borderBottomWidth: 1,
    //borderTopWidth: 1,
    borderColor: '#e0e0e6',
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
  toggleGroupButton: {
    borderWidth: 1,
    //borderColor: iosColors.green,
    //backgroundColor: iosColors.green,
    height: 35,
    width: 35,
    borderRadius: 70,
    justifyContent: 'center',
  },
});


const pickerStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#e0e0e6',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    color: iosColors.black,
  },
  inputAndroid: {
    backgroundColor: '#e0e0e6',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    color: iosColors.black,
  },
})

export default EditTeacherScreen;