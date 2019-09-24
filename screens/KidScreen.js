import React, { useState } from 'react';
import { Platform, Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import useGlobalHook from '../store';
import { iosColors, formatDateString } from '../util';
import orderBy from 'lodash/orderBy';

const KidScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();
  const [searchFilter, setSearchFilter] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const renderList = () => {
    if (!globalState.allKids || globalState.allKids.length === 0) return null;

    let arr = null;
    if (searchTerm === '') {
      arr = globalState.allKids;
    } else {
      if (searchFilter === 'name') {
        arr = globalState.allKids.filter(kid => kid.firstName.toUpperCase().includes(searchTerm.toUpperCase()))
      } else if (searchFilter === 'group') {
        arr = globalState.allKids.filter(kid => kid.childgroup.name.toUpperCase().includes(searchTerm.toUpperCase()))
      }
    }

    arr = orderBy(arr, ['childgroup.name', 'firstName'], ['asc']);

    return arr.map((kid, idx) => {
      const _styles = idx === 0 ? [styles.listItem_first, styles.listItem] : [styles.listItem];

      return (
        <View style={styles.listItem}>
          <View style={styles.listItem_left}>
            <Text style={{fontWeight: 'bold', textTransform: 'uppercase', color: iosColors.black}}>
              {kid.firstName}
            </Text>
            <Text style={{paddingTop: 5, color: iosColors.black}}>
              {kid.childgroup.name}
            </Text>
            <Text style={{paddingTop: 5, color: iosColors.black}}>
              Syntymäpäivä: {kid.birthday ? formatDateString(kid.birthday, 'dd.mm.yyyy') : '–'}
            </Text>
          </View>
          <View style={styles.listItem_right}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('editKid', {
                kid: kid,
                clearSearchTerm: (() => setSearchTerm(() => ''))
              })}
            >
              <View style={styles.buttonContent}>
                <Icon
                  name="edit"
                  type="font-awesome"
                  color={iosColors.grey}
                  size={30}
                />
                <Text style={styles.buttonText}>MUOKKAA</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    })
  }

  const getSearchBarPlatform = () => {
    if (Platform.OS === 'android') {
      return 'android';
    } else if (Platform.OS === 'ios') {
      return 'ios';
    } else {
      return 'default';
    }
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: 20, paddingBottom: searchTerm === '' ? 20 : 230}}
      >
        <View>
          <SearchBar
            platform={getSearchBarPlatform()}
            containerStyle={styles.searchBarContainer}
            placeholder="Hae"
            onChangeText={search => setSearchTerm(() => search)}
            value={searchTerm}
          />
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',}}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setSearchFilter(() => 'name')}
            >
              <Text style={searchFilter === 'name' ? styles.filterButtonSelected_text : styles.filterButton_text}>
                Hae muksun nimellä
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setSearchFilter(() => 'group')}
            >
              <Text style={searchFilter === 'group' ? styles.filterButtonSelected_text : styles.filterButton_text}>
                Hae ryhmällä
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{paddingTop: 10}}>
          {renderList()}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

KidScreen.navigationOptions = ({ navigation }) => ({
  title: 'Muksut',
  headerRight: (
    <TouchableOpacity style={{marginRight: 15}}>
      <Text style={{color: iosColors.darkBlue, fontSize: 16}}>
        Lisää muksu
      </Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 0,
  },
  filterButton: {
    padding: 5,
  },
  filterButton_text: {
    color: iosColors.grey,
  },
  filterButtonSelected_text: {
    fontWeight: 'bold',
    color: iosColors.grey,
  },
  listItem_first: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ededed',
    padding: 20
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

  },
  listItem_right: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    borderRadius: 4,
    borderColor: iosColors.grey,

  },
  deleteButton: {
    backgroundColor: iosColors.red,
    borderRadius: 4,
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonText: {
    color: iosColors.grey,
    fontWeight: 'bold',
    //paddingTop: 8,
  }
});

export default KidScreen;