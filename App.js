import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import useGlobalHook from './store';
import * as Font from 'expo-font';

import HomeScreen from './screens/HomeScreen';
import KidScreen from './screens/KidScreen';
import TeacherScreen from './screens/TeacherScreen';
import GroupScreen from './screens/GroupScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import CalendarScreen from './screens/CalendarScreen';
import EditKidScreen from './screens/EditKidScreen';
import EditTeacherScreen from './screens/EditTeacherScreen';
import { iosColors } from './util';

const MainNavigator = createBottomTabNavigator({
  main: HomeScreen,
  kid: createStackNavigator({
    kid: KidScreen,
    editKid: EditKidScreen
  },{
    navigationOptions: {
      tabBarLabel: 'Muksut',
    },
    defaultNavigationOptions: {
      headerStyle: {
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: iosColors.black,
        backgroundColor: '#fafafa',
      }
    }
  }),
  teacher: createStackNavigator({
    teacher: TeacherScreen,
    editTeacher: EditTeacherScreen
  },{
    navigationOptions: {
      tabBarLabel: 'Opet',
    },
    defaultNavigationOptions: {
      headerStyle: {
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: iosColors.black,
        backgroundColor: '#fafafa',
      }
    }
  }),
  group: GroupScreen,
  schedule: createStackNavigator({
    schedule: ScheduleScreen,
    calendar: CalendarScreen,
  },{
    navigationOptions: {
      tabBarLabel: 'Aikataulut',
    },
    defaultNavigationOptions: {
      headerStyle: {
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: iosColors.black,
        backgroundColor: '#fafafa',
      }
    }
  })
},{
  initialRouteName: 'main',
});

const AppContainer = createAppContainer(MainNavigator);

export default function App() {
  const [globalState, globalActions] = useGlobalHook();

  useEffect(() => {
    /* Font.loadAsync({
      'SFUI-regular': require('./assets/fonts/SF-UI-Display-Regular.otf'),
    }); */
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
  }
});
