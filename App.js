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
    calendar: CalendarScreen
  },{
    defaultNavigationOptions: {
      //header: null,
      tabBarLabel: 'juuukeli',
      headerStyle: {
        height: 50,
        fontSize: 30,
        //marginBottom: 15
      }
    }
  })
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
