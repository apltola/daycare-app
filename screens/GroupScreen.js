import React, { useState } from 'react';
import { StyleSheet, Animated, View, Text, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Header from '../components/Header';
import { iosColors, getSearchBarPlatform } from '../util';
import useGlobalHook from '../store';
import globalStyles from '../util/globalStyles';
import EditButton from '../components/EditButton';

const GroupScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();
  const [searchTerm, setSearchTerm] = useState('');

  const renderGroupList = () => {
    let arr = [];
    if (searchTerm === '') {
      arr = globalState.childGroups;
    } else {
      arr = globalState.childGroups.filter(i => i.name.toUpperCase().includes(searchTerm.toUpperCase()));
    }

    return arr.map(group => {
      return (
        <View style={styles.listItem}>
          <View style={styles.listItem_left}>
            <Text style={styles.groupName}>
              {group.name}
            </Text>
          </View>
          <View style={styles.listItem_right}>
            <EditButton
              onPress={() => navigation.navigate('editGroup', {
                group: group,
                addNewGroup: false,
                clearSearchTerm: (() => setSearchTerm(''))
              })}
            />
          </View>
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
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
          inputStyle={{backgroundColor: '#e0e0e6'}}
          inputContainerStyle={{backgroundColor: '#e0e0e6',borderRadius:10}}
        />

        <View>
          {renderGroupList()}
        </View>


        <View style={{marginTop: 60}}>
          <Text>
            groups: {JSON.stringify(globalState.childGroups || {}, null, 2)}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

GroupScreen.navigationOptions = ({ navigation }) => ({
  title: 'Ryhmät',
  headerRight: (
    <TouchableOpacity
      style={{marginRight: 15}}
      onPress={() => navigation.navigate('editGroup', {
        addNewGroup: true
      })}
    >
      <Text style={{color: iosColors.darkBlue, fontSize: 16}}>
        Lisää ryhmä
      </Text>
    </TouchableOpacity>
  ),
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ededed',
    padding: 20,
  },
  listItem_left: {
    flex: 1,
    justifyContent: 'center',
    //borderWidth: 0.5
  },
  listItem_right: {
    //flex: 1,
    //borderWidth: 0.5
  },
  groupName: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: iosColors.black,
  }
});

export default GroupScreen