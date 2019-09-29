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

function EditTeacherScreen({ navigation }) {
  const teacher = navigation.getParam('teacher', {
    name: '',
    childgroups: []
  });
  const addNewTeacher = navigation.getParam('addNewTeacher', false);
  const clearSearchTerm = navigation.getParam('clearSearchTerm');

  const [globalState, globalActions] = useGlobalHook();
  const [initialTeacherData, setInitialTeacherData] = useState({});
  const [postData, setPostData] = useState(teacher);
  const [res, setRes] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);

  useEffect(() => {
    setInitialTeacherData(navigation.getParam('teacher', {}));

    return () => {};
  }, []);

  const handleGroupToggled = (group, addGroup) => {
    let groups = [];
    if (addGroup) {
      groups = [...postData.childgroups, group];
    } else {
      groups = postData.childgroups.filter(i => i.id !== group.id);
    }

    return setPostData({...postData, childgroups: groups});
  }

  const saveButtonShouldBeDisabled = () => {
    if (addNewTeacher) {
      return !(postData.name && postData.childgroups.length > 0);
    } else {
      return isEqual(initialTeacherData, postData);
    }
  }

  const handleSave = async () => {
    setLoading(true);

    if (addNewTeacher) {
      try {
        const res = await axios.post(`${apiRoot}/teacher/add`, postData);
        setRes(res);
        setLoading(false);
        setShowNotificationDialog(true);
        await globalActions.fetchTeachers();
      } catch(err) {
        setRes(res);
        setLoading(false);
        setShowNotificationDialog(true);
      }
    } else {

    }
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${apiRoot}/teacher/delete/${teacher.id}`)
      setRes(res);
      setShowConfirmationDialog(false);
      clearSearchTerm();
      globalActions.fetchTeachers();
      navigation.navigate('teacher');
    } catch(err) {
      setRes(res);
      setShowConfirmationDialog(false);
      setShowNotificationDialog(true);
    }
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

        <View style={styles.section}>
          <View style={styles.buttonContainer}>
            {loading
              ? <Spinner size="small" />
              : <Button
                  onPress={handleSave}
                  style="green"
                  title="Tallenna"
                  disabled={saveButtonShouldBeDisabled()}
                />
            }
          </View>
          {
            !addNewTeacher &&
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => setShowConfirmationDialog(true)}
                style='red'
                title={`Poista ${teacher.name}`}
                disabled={false}
              />
            </View>
          }
        </View>

        <Popup
          dialogType='submitNotification'
          visible={showNotificationDialog}
          handleTouchOutside={() => setShowNotificationDialog(false)}
          handlePopupClose={() => setShowNotificationDialog(false)}
          submitWasSuccessful={res.status === 200}
        />

        <Popup
          dialogType='deleteConfirmation'
          visible={showConfirmationDialog}
          handleTouchOutside={() => setShowConfirmationDialog(() => false)}
          handlePopupClose={() => setShowConfirmationDialog(() => false)}
          handlePopupConfirm={handleDelete}
          submitWasSuccessful={res.status === 200}
          item={teacher}
        />

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
  buttonContainer: {
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default EditTeacherScreen;