import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TextInput, TouchableOpacity, } from 'react-native';
import { iosColors } from '../util';
import DateTimePicker from "react-native-modal-datetime-picker";

const EditKidScreen = ({ navigation }) => {
  const kid = navigation.getParam('kid', {});
  const [name, setName] = useState(kid.firstName);
  const [birthday, setBirthday] = useState(kid.birthday);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDatePicked = date => {
    setShowDatePicker(false);
    console.log('date picked ==> ', date);
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{padding: 15}}
      >
        <View>
          <Text style={styles.label}>
            Nimi
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => setName(() => text)}
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
              {birthday || '–'}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          date={birthday || new Date()}
          isVisible={showDatePicker}
          onConfirm={handleDatePicked}
          onCancel={() => setShowDatePicker(false)}
          mode="date"
          cancelTextIOS="Peruuta"
          confirmTextIOS="Ok"
          titleIOS={'Aseta syntymäpäivä'}
        />
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
  }
});

export default EditKidScreen;