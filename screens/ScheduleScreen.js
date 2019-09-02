import React, { useState, useEffect } from 'react';
import useGlobalHook from '../store';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { iosColors } from '../util';


export default ScheduleScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: 20}}
        style={styles.scrollView}
      >
        <View style={styles.searchBar}>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title_text}>
            Avaa muksun kalenteri
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowSearchBar(() => true)}
          >
            <Image
              style={styles.icon}
              source={require('../assets/search.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {globalState.allKids.map(kid => {
            return (
              <View style={styles.kidItem}>
                <TouchableOpacity
                  style={styles.kidButton}
                  onPress={() => navigation.navigate('calendar', {
                    kid: kid
                  })}
                >
                  <Text style={styles.kidButton_text}>
                    {kid.firstName}, {kid.childgroup.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

      </Animated.ScrollView>
    </View>
  );
}

ScheduleScreen.navigationOptions = () => ({
  title: 'Aikataulut',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 0,
  },
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10,
    //paddingTop: 10
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    //borderWidth: 1,
  },
  title_text: {
    textAlign: 'left',
    fontWeight: 'bold',
    flexGrow: 1,
    position: 'absolute',
    //borderWidth: 1,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  searchButton: {
    borderWidth: 0.5,
    borderColor: iosColors.grey,
    borderRadius: 5,
    backgroundColor: '#fefefe',
    flexGrow: 0,
    padding: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
  listContainer: {
    paddingTop: 20,
  },
  kidItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  kidButton: {
    //borderWidth: 1,
    marginBottom: 10,
  },
  kidButton_text: {
    color: iosColors.darkBlue,
    fontSize: 20,
  }

});