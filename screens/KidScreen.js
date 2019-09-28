import React, { useState } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import useGlobalHook from '../store';
import { iosColors, formatDateString, getSearchBarPlatform } from '../util';
import globalStyles from '../util/globalStyles';
import orderBy from 'lodash/orderBy';
import EditButton from '../components/EditButton';

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
            <EditButton
              onPress={() => navigation.navigate('editKid', {
                kid: kid,
                clearSearchTerm: (() => setSearchTerm(() => ''))
              })}
            />
          </View>
        </View>
      )
    })
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: 20, paddingBottom: searchTerm === '' ? 20 : 230}}
      >
        <View>
          <SearchBar
            platform={getSearchBarPlatform()}
            containerStyle={globalStyles.searchBarContainer}
            placeholder="Hae"
            onChangeText={search => setSearchTerm(() => search)}
            value={searchTerm}
            cancelButtonTitle='Sulje'
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
    <TouchableOpacity
      style={{marginRight: 15}}
      onPress={() => navigation.navigate('editKid', {
        addNewKid: true
      })}
    >
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
  }
});

export default KidScreen;