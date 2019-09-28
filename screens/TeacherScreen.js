import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Animated, View, Text, TouchableOpacity } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import useGlobalHook from '../store';
import orderBy from 'lodash/orderBy';
import { getSearchBarPlatform, iosColors } from '../util';
import globalStyles from '../util/globalStyles';


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
      
      <Animated.ScrollView style={styles.scrollView}>
        <SearchBar
          platform={getSearchBarPlatform()}
          containerStyle={globalStyles.searchBarContainer}
          placeholder="Hae"
          onChangeText={search => setSearchTerm(() => search)}
          value={searchTerm}
          cancelButtonTitle='Sulje'
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
    paddingVertical: 20,
  },
});

TeacherScreen.navigationOptions = ({ navigation }) => ({
  title: 'Opet',
  headerRight: (
    <TouchableOpacity
      style={{marginRight: 15}}
      onPress={() => navigation.navigate('editTeacher', {
        addNewTeacher: true
      })}
    >
      <Text style={{color: iosColors.darkBlue, fontSize: 16}}>
        Lisää ope
      </Text>
    </TouchableOpacity>
  ),
})

export default TeacherScreen;