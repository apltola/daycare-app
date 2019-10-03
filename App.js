import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import useGlobalHook from './store';

import HomeScreen from './screens/HomeScreen';
import KidScreen from './screens/KidScreen';
import EditKidScreen from './screens/EditKidScreen';
import TeacherScreen from './screens/TeacherScreen';
import EditTeacherScreen from './screens/EditTeacherScreen';
import GroupScreen from './screens/GroupScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import CalendarScreen from './screens/CalendarScreen';
import { iosColors } from './util';
import EditGroupScreen from './screens/EditGroupScreen';

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
  group: createStackNavigator({
    group: GroupScreen,
    editGroup: EditGroupScreen
  },{
    navigationOptions: {
      tabBarLabel: 'Ryhmät',
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
  initialRouteName: 'group',
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
  },
});
