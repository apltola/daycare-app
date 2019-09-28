import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Animated, View, Text, TouchableOpacity } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import useGlobalHook from '../store';
import orderBy from 'lodash/orderBy';
import { getSearchBarPlatform, iosColors } from '../util';
import globalStyles from '../util/globalStyles';
import EditButton from '../components/EditButton';

const TeacherScreen = ({ navigation }) => {
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
    arr = orderBy(arr, ['name'], ['asc']);

    return arr.map(teacher => {
      return (
        <View style={styles.listItem}>
          <View style={styles.listItem_left}>
            <Text style={{fontWeight: 'bold', textTransform: 'uppercase', color: iosColors.black}}>
              {teacher.name}
            </Text>
            <Text style={{paddingTop: 5, color: iosColors.black}}>
              Ryhmät: {teacher.childgroups.map(i => i.name).join(', ')}
            </Text>
          </View>
          <View style={styles.listItem_right}>
            <EditButton
              onPress={() => {
                navigation.navigate('editTeacher', {
                  teacher: teacher,
                  clearSearchTerm: (() => setSearchTerm(() => ''))
                });
              }}
            />
          </View>
        </View>
      )
    })
  }

  return (
    <View style={{flex: 1}}>
      
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: 20, paddingBottom: searchTerm === '' ? 20 : 230}}
      >
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
  listItem: {
    borderBottomWidth: 1,
    borderColor: '#ededed',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  listItem_left: {
    flex: 1,
    //borderWidth: 1,
  },
  listItem_right: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    //borderWidth: 1,
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