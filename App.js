import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import useGlobalHook from './store';

import KidListScreen from './screens/KidListScreen';
import KidScreen from './screens/KidScreen';
import TeacherScreen from './screens/TeacherScreen';
import GroupScreen from './screens/GroupScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import CalendarScreen from './screens/CalendarScreen';
import EditKidScreen from './screens/EditKidScreen';
import { iosColors } from './util';

const MainNavigator = createBottomTabNavigator({
  main: KidListScreen,
  //kid: KidScreen,
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
  teacher: TeacherScreen,
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
  initialRouteName: 'schedule',
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
