import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, Text, TouchableOpacity } from 'react-native';
import useGlobalHook from '../store';
import Header from '../components/Header';

const TeacherScreen = () => {
  const [globalState, globalActions] = useGlobalHook();

  useEffect(() => {
    globalActions.fetchTeachers();
    
    return () => {};
  }, []);

  const renderTeachers = () => {
    const arr = globalState.teachers;

    return arr.map((teacher, idx) => {
      return (
        <View>
          <Text>
            {teacher.name}
          </Text>
        </View>
      );
    });
  }

  return (
    <View style={{flex: 1}}>
      <Header title="ope" />

      <Animated.ScrollView>
        {renderTeachers()}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

});

TeacherScreen.navigationOptions = ({ navigation }) => ({
  title: 'Ope'
})

export default TeacherScreen;