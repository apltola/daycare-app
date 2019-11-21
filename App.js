import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import useGlobalHook from './store';
import { iosColors } from './util';

import HomeScreen from './screens/HomeScreen';
import KidScreen from './screens/KidScreen';
import EditKidScreen from './screens/EditKidScreen';
import TeacherScreen from './screens/TeacherScreen';
import EditTeacherScreen from './screens/EditTeacherScreen';
import GroupScreen from './screens/GroupScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import CalendarScreen from './screens/CalendarScreen';
import EditGroupScreen from './screens/EditGroupScreen';

const headerStyle = {
  height: 50,
  borderBottomWidth: 0.5,
  borderBottomColor: iosColors.black,
  backgroundColor: '#fafafa',
}

const MainNavigator = createBottomTabNavigator({
  main: HomeScreen,
  kid: createStackNavigator({
    kid: KidScreen,
    editKid: EditKidScreen
  },{
    navigationOptions: {
      tabBarLabel: 'Muksut',
    },
    defaultNavigationOptions: { headerStyle }
  }),
  teacher: createStackNavigator({
    teacher: TeacherScreen,
    editTeacher: EditTeacherScreen
  },{
    navigationOptions: {
      tabBarLabel: 'Opet',
    },
    defaultNavigationOptions: { headerStyle }
  }),
  group: createStackNavigator({
    group: GroupScreen,
    editGroup: EditGroupScreen
  },{
    navigationOptions: {
      tabBarLabel: 'Ryhmät',
    },
    defaultNavigationOptions: { headerStyle }
  }),
  schedule: createStackNavigator({
    schedule: ScheduleScreen,
    calendar: CalendarScreen,
  },{
    navigationOptions: {
      tabBarLabel: 'Aikataulut',
    },
    defaultNavigationOptions: { headerStyle }
  })
},{
  initialRouteName: 'schedule',
});

const AppContainer = createAppContainer(MainNavigator);

export default function App() {
  const [globalState, globalActions] = useGlobalHook();

  useEffect(() => {
    globalActions.fetchAllKids();
    globalActions.fetchChildGroups();

    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <AppContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
