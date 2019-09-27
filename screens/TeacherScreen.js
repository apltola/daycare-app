import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Animated, View, Text, TouchableOpacity } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import useGlobalHook from '../store';
import Header from '../components/Header';
import orderBy from 'lodash/orderBy';
import { getSearchBarPlatform } from '../util';


const TeacherScreen = () => {
  const [globalState, globalActions] = useGlobalHook();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    globalActions.fetchTeachers();
    
    return () => {};
  }, []);

  const renderTeachers = () => {
    let arr = [];

    if (searchTerm === '') {
      arr = globalState.teachers;
    } else {
      arr = globalState.teachers.filter(i => i.name.toUpperCase().includes(searchTerm.toUpperCase()));
    }
    arr = orderBy(globalState.teachers, ['name'], ['asc']);

    return arr.map(teacher => {
      return (
        <View>
          <Text>
            {teacher.name}
          </Text>
        </View>
      )
    })
  }

  return (
    <View style={{flex: 1}}>
      <Header title="ope" noMargin={true} />
      
      <Animated.ScrollView style={styles.scrollView}>
        <SearchBar
          platform={getSearchBarPlatform()}
          containerStyle={styles.searchBarContainer}
          placeholder="Hae"
          onChangeText={search => setSearchTerm(() => search)}
          value={searchTerm}
          cancelButtonTitle='Sulje'
          cancelButtonProps={{buttonStyle: styles.searchCancelButton}}
        />

        <View>
          {renderTeachers()}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  searchBarContainer: {
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5,
    //paddingTop: 0,
  },
  searchCancelButton: {
    borderWidth: 1,
    borderColor: 'red',
    paddingTop: 0,
    marginTop: 0,
  }
});

TeacherScreen.navigationOptions = ({ navigation }) => ({
  title: 'Ope'
})

export default TeacherScreen;