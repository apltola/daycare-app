import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TextInput } from 'react-native';
import axios from 'axios';
import { iosColors } from '../util';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import isEqual from 'lodash/isEqual';

const EditGroupScreen = ({ navigation }) => {
  const group = navigation.getParam('group', {
    name: ''
  });
  const addNewGroup = navigation.getParam('addNewGroup', false);

  const [postData, setPostData] = useState(group);
  const [initialGroupData, setInitialGroupData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [submitResult, setSubmitResult] = useState({});

  useEffect(() => {
    setInitialGroupData(navigation.getParam('group', { name: '' }));

    return () => {};
  }, []);

  const saveButtonShouldBeDisabled = () => {
    if (addNewGroup) {
      return !postData.name;
    } else {
      return isEqual(initialGroupData, postData);
    }
  }

  const handleSave = () => {

  }

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
                  title="Tallenna"
                  disabled={saveButtonShouldBeDisabled()}
                />
            }
          </View>
          {
            !addNewGroup &&
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => setShowConfirmationDialog(true)}
                style='red'
                title={`Poista ${group.name}`}
                disabled={false}
              />
            </View>
          }
        </View>

        <View style={{paddingTop: 60}}>
          <Text>postData: {JSON.stringify(postData, {}, 2)}</Text>
          <Text>initialGroupData: {JSON.stringify(initialGroupData, {}, 2)}</Text>
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