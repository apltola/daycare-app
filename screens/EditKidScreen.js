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

const EditKidScreen = ({ navigation }) => {
  const kid = navigation.getParam('kid', {
    birthday: null,
    present: false,
    childgroup: {},
    firstName: ''
  });
  const addNewKid = navigation.getParam('addNewKid', false);
  const clearSearchTerm = navigation.getParam('clearSearchTerm');
  
  const [globalState, globalActions] = useGlobalHook();
  const [initialKidData, setInitialKidData] = useState({});
  const [postData, setPostData] = useState(kid);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    setInitialKidData(navigation.getParam('kid', {}));

    return () => {};
  }, []);

  const handleDatePicked = date => {
    setShowDatePicker(false);
    try {
      const dateStr = formatDateString(new Date(date), 'yyyy-mm-dd');
      setPostData(() => ({...postData, birthday: dateStr}));
    } catch(e) {
      console.log(e);
    }
  }

  const handleGroupPicked = group => {
    if (!group) {
      return;
    }
    const idx = globalState.childGroups.findIndex(i => i.id === group);
    setPostData(() => ({...postData, childgroup: globalState.childGroups[idx]}));
  }

  const handleSubmit = async () => {
    setLoading(() => true);

    if (addNewKid) {
      try {
        const res = await axios.post(`${apiRoot}/child/add`, postData);
        setRes(() => res);
        setLoading(() => false);
        await globalActions.fetchAllKids();
      } catch (e) {
        setRes(() => res);
        setLoading(() => false);
      }
    } else {
      try {
        const res = await axios.put(`${apiRoot}/child/edit`, postData)
        setRes(() => res);
        setLoading(() => false);
        setInitialKidData(() => postData);
        setShowDialog(() => true);
        globalActions.fetchAllKids();
      } catch (e) {
        setRes(() => res);
        setLoading(() => false);
        setShowDialog(() => true);
      }
    }
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${apiRoot}/child/delete/${kid.id}`);
      setRes(() => res);
      setShowConfirmationDialog(() => false);
      clearSearchTerm();
      globalActions.fetchAllKids();
      navigation.navigate('kid');
    } catch (e) {
      console.log(e);
      setRes(() => res);
      setShowConfirmationDialog(() => false);
    }
  }

  const submitButtonShouldBeDisabled = () => {
    if (addNewKid) {
      return !(postData.firstName && postData.childgroup.id);
    } else {
      return isEqual(initialKidData, postData);
    }
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{padding: 20}}
      >
        <View>
          <Text>
            {addNewKid ? 'Lisää uusi muksu' : `Muokkaa muksua ${kid.firstName}`}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>
            Nimi
          </Text>
          <TextInput
            style={styles.input}
            value={postData.firstName}
            onChangeText={text => setPostData({...postData, firstName: text})}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>
            Syntymäpäivä
          </Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.bdButton_text}>
              {postData.birthday ? formatDateString(postData.birthday, 'dd.mm.yyyy') : '–'}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          date={postData.birthday ? new Date(postData.birthday) : new Date()}
          isVisible={showDatePicker}
          onConfirm={handleDatePicked}
          onCancel={() => setShowDatePicker(false)}
          mode="date"
          cancelTextIOS="Peruuta"
          confirmTextIOS="Ok"
          titleIOS={'Aseta syntymäpäivä'}
        />

        <View style={styles.section}>
          <Text style={styles.label}>
            Ryhmä
          </Text>
          <RNPickerSelect
            placeholder={{
              label: 'Valitse ryhmä',
              value: null,
              color: iosColors.grey,
            }}
            value={postData.childgroup.id}
            onValueChange={value => handleGroupPicked(value)}
            style={pickerStyles}
            items={
              globalState.childGroups.map(group => {
                return (
                  { label: group.name, value: group.id }
                )
              })
            }
            doneText='Valmis'
          />
        </View>

        <View style={{paddingTop: 20}}>
          <View style={styles.buttonContainer}>
            {loading
              ? <Spinner size="small" />
              : <Button
                  onPress={handleSubmit}
                  style="green"
                  title="Tallenna"
                  disabled={submitButtonShouldBeDisabled()}
                />
            }
          </View>
          {
            !addNewKid &&
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => setShowConfirmationDialog(true)}
                style="red"
                title={`Poista ${initialKidData.firstName}`}
                disabled={false}
              />
            </View>
          }
        </View>

        <Popup
          dialogType='submitNotification'
          visible={showDialog}
          handleTouchOutside={() => setShowDialog(() => false)}
          handlePopupClose={() => setShowDialog(() => false)}
          submitWasSuccessful={res.status === 200}
        />

        <Popup
          dialogType='deleteConfirmation'
          visible={showConfirmationDialog}
          handleTouchOutside={() => setShowConfirmationDialog(() => false)}
          handlePopupClose={() => setShowConfirmationDialog(() => false)}
          handlePopupConfirm={handleDelete}
          submitWasSuccessful={res.status === 200}
          kid={kid}
        />

        <View style={{marginTop: 60}}>
          <Text>
            kid: {JSON.stringify(kid || {}, null, 2)}
          </Text>
          <Text>
            postData: {JSON.stringify(postData || {}, null, 2)}
          </Text>
          <Text>
            res: {JSON.stringify(res || {}, null, 2)}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    paddingTop: 20,
  },
  buttonContainer: {
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: iosColors.black,
    fontFamily: 'San Francisco',
  },
  input: {
    backgroundColor: '#e0e0e6',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  bdButton_text: {
    fontSize: 16,
  },
});

// https://snack.expo.io/@lfkwtz/react-native-picker-select
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

export default EditKidScreen;