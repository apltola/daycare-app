import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import useGlobalHook from './store';

import Header from './components/Header';
import KidListScreen from './screens/KidListScreen';
import KidScreen from './screens/KidScreen';
import TeacherScreen from './screens/TeacherScreen';
import GroupScreen from './screens/GroupScreen';
import ScheduleScreen from './screens/ScheduleScreen';

const MainNavigator = createBottomTabNavigator({
  main: KidListScreen,
  kid: KidScreen,
  teacher: TeacherScreen,
  group: GroupScreen,
  schedule: ScheduleScreen
});

const AppContainer = createAppContainer(MainNavigator);

export default function App() {
  const [globalState, globalActions] = useGlobalHook();

  useEffect(() => {
    globalActions.fetchAllKids();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Header title="childMinder_3000" />
      <AppContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //paddingTop: 50
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
