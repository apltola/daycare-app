import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import useGlobalHook from './store';

import Header from './components/Header';
import KidListScreen from './screens/KidListScreen';
import KidScreen from './screens/KidScreen';
import TeacherScreen from './screens/TeacherScreen';
import GroupScreen from './screens/GroupScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import CalendarScreen from './screens/CalendarScreen';

const MainNavigator = createBottomTabNavigator({
  main: KidListScreen,
  kid: KidScreen,
  teacher: TeacherScreen,
  group: GroupScreen,
  schedule: createStackNavigator({
    schedule: ScheduleScreen,
    calendar: CalendarScreen,
  },{
    navigationOptions: {
      //header: null,
      tabBarLabel: 'Aikataulut',
      headerStyle: {
        height: 50,
        fontSize: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        //marginBottom: 15
      }
    }
  })
},{
  tabBarOptions: {
    labelStyle: {
      //fontSize: 20
    }
  }
});

const AppContainer = createAppContainer(MainNavigator);
const juukeli = 'juukeli';

export default function App() {
  const [globalState, globalActions] = useGlobalHook();

  useEffect(() => {
    globalActions.fetchAllKids();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      {/* <Header title="kidTracker_3000" /> */}
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
