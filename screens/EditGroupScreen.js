import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TextInput } from 'react-native';
import axios from 'axios';
import { apiRoot, iosColors } from '../util';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import isEqual from 'lodash/isEqual';
import Popup from '../components/Popup';
import useGlobalHook from '../store';

const EditGroupScreen = ({ navigation }) => {
  const group = navigation.getParam('group', {
    name: ''
  });
  const addNewGroup = navigation.getParam('addNewGroup', false);
  const clearSearchTerm = navigation.getParam('clearSearchTerm', () => {});

  const [globalState, globalActions] = useGlobalHook();
  const [postData, setPostData] = useState(group);
  const [initialGroupData, setInitialGroupData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [submitResult, setSubmitResult] = useState({});
  const [submitType, setSubmitType] = useState('');
  const [groupHasBeenAdded, setGroupHasBeenAdded] = useState(false);

  useEffect(() => {
    setInitialGroupData(navigation.getParam('group', { name: '' }));

    return () => {};
  }, []);

  const saveButtonShouldBeDisabled = () => {
    if (addNewGroup) {
      return !postData.name || groupHasBeenAdded;
    } else {
      return isEqual(initialGroupData, postData);
    }
  }

  const groupHasKids = () => {
    return globalState.allKids.findIndex(i => i.childgroup.id === group.id) > -1;
  }

  const handleSave = async () => {
    setLoading(true);

    if (addNewGroup) {
      setSubmitType('add');
      try {
        const res = await axios.post(`${apiRoot}/childgroup/add`, postData);
        await globalActions.fetchChildGroups();
        setSubmitResult(res);
        setGroupHasBeenAdded(true);
        setShowNotificationDialog(true);
        setLoading(false);
      } catch(e) {
        setSubmitResult(res);
        setShowNotificationDialog(true);
        setLoading(false);
      }
    } else {

    }
  }

  const handleDeleteGroup = async () => {
    setLoading(true);
    setSubmitType('delete');

    try {
      const res = await axios.delete(`${apiRoot}/childgroup/delete/${group.id}`);
      await globalActions.fetchChildGroups();
      setSubmitResult(res);
      setLoading(false);
      setShowConfirmationDialog(false);
      clearSearchTerm();
      navigation.navigate('group');
    } catch(e) {
      setShowConfirmationDialog(false);
      setShowNotificationDialog(true);
      setLoading(false);
      setSubmitResult(res);
    }
  }

  const openErrorDialog = () => setShowErrorNotification(true);
  const openConfirmationDialog = () => setShowConfirmationDialog(true);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ padding: 20 }}
      >
        <View>
          <Text style={{fontSize: 16}}>
            {addNewGroup ? 'Lisää uusi ryhmä' : `Muokkaa ryhmää ${group.name}`}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>
            Ryhmän nimi
          </Text>
          <TextInput
            style={styles.input}
            value={postData.name}
            onChangeText={text => setPostData({...postData, name: text})}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.buttonContainer}>
            {loading
              ? <Spinner size="small" />
              : <Button
                  onPress={handleSave}
                  style="green"
                  title={addNewGroup ? 'Lisää' : 'Tallenna'}
                  disabled={saveButtonShouldBeDisabled()}
                />
            }
          </View>
          {
            !addNewGroup &&
            <View style={styles.buttonContainer}>
              <Button
                onPress={groupHasKids() ? openErrorDialog : openConfirmationDialog}
                style='red'
                title={`Poista ${group.name}`}
                disabled={false}
              />
            </View>
          }
        </View>

        <Popup
          dialogType='submitNotification'
          actionType={submitType}
          visible={showNotificationDialog}
          handleTouchOutside={() => setShowNotificationDialog(() => false)}
          handlePopupClose={() => setShowNotificationDialog(() => false)}
          submitWasSuccessful={submitResult.status === 200}
        />

        <Popup
          dialogType='deleteConfirmation'
          visible={showConfirmationDialog}
          handleTouchOutside={() => setShowConfirmationDialog(() => false)}
          handlePopupClose={() => setShowConfirmationDialog(() => false)}
          handlePopupConfirm={() => handleDeleteGroup()}
          submitWasSuccessful={submitResult.status === 200}
          item={group}
        />

        <Popup
          dialogType='errorDescription'
          actionType='groupDelete'
          visible={showErrorNotification}
          handleTouchOutside={() => setShowErrorNotification(() => false)}
          handlePopupClose={() => setShowErrorNotification(() => false)}
          //submitWasSuccessful={submitResult.status === 200}
          item={group}
        />

        <View style={{paddingTop: 60}}>
          <Text>addNewGroup: {JSON.stringify(addNewGroup, {}, 2)}</Text>
          <Text>postData: {JSON.stringify(postData, {}, 2)}</Text>
          <Text>initialGroupData: {JSON.stringify(initialGroupData, {}, 2)}</Text>
          <Text>res: {JSON.stringify(submitResult, {}, 2)}</Text>
          {/* <Text>all kids: {JSON.stringify(globalState.allKids, {}, 2)}</Text> */}
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
  input: {
    backgroundColor: '#e0e0e6',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  buttonContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
});

export default EditGroupScreen;