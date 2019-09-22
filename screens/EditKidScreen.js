import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { iosColors, formatDateString } from '../util';
import DateTimePicker from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import useGlobalHook from '../store';

const EditKidScreen = ({ navigation }) => {
  const kid = navigation.getParam('kid', {});
  const [postData, setPostData] = useState(kid);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [globalState, globalActions] = useGlobalHook();

  useEffect(() => {
    globalActions.fetchChildGroups();

    return () => {};
  }, []);

  const handleDatePicked = date => {
    setShowDatePicker(false);
    const dateStr = formatDateString(date, 'yyyy-mm-dd');
    setPostData(() => ({...postData, birthday: dateStr}));
  }

  const handleGroupPicked = group => {
    const idx = globalState.childGroups.findIndex(i => i.id === group);
    setPostData(() => ({...postData, childgroup: globalState.childGroups[idx]}));
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{padding: 15}}
      >
        <View>
          <Text>
            Muokkaa muksua: {kid.firstName}
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
              {postData.birthday || '–'}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          date={postData.birthday || new Date()}
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

        <View style={{marginTop: 60}}>
          <Text>
            postData: {JSON.stringify(postData || {}, null, 2)}
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    //paddingLeft: 8,
    paddingBottom: 5,
    color: iosColors.black,
  },
  input: {
    //backgroundColor: '#d3d1d7',
    //backgroundColor: '#e0dada',
    backgroundColor: '#e0e0e6',
    padding: 10,
    borderRadius: 5,
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

export default EditKidScreen;