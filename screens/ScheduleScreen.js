import React, { useState, useEffect } from 'react';
import useGlobalHook from '../store';
import { StyleSheet, View, Text, Animated, Image, TextInput} from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { iosColors } from '../util';
import globalStyles from '../util/globalStyles';
import orderBy from 'lodash/orderBy';

const ScheduleScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('name');

  const renderList = () => {
    let arr = null
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

      return (
        <View style={styles.listItem}>
          <TouchableOpacity
            style={styles.kidButton}
            onPress={() => navigation.navigate('calendar', {
              kid: kid
            })}
          >
            <View>
            <Text style={{fontWeight: 'bold', textTransform: 'uppercase', color: iosColors.black}}>
              {kid.firstName}
            </Text>
            <Text style={{paddingTop: 5, color: iosColors.black}}>
              {kid.childgroup.name}
            </Text>
            </View>
            <Icon
              name="chevron-right"
              type="font-awesome"
              color={iosColors.grey}
              size={20}
            />
          </TouchableOpacity>
        </View>
      );
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
            containerStyle={globalStyles.searchBarContainer}
            placeholder="Hae"
            onChangeText={search => setSearchTerm(() => search)}
            value={searchTerm}
            cancelButtonTitle='Sulje'
            inputStyle={{backgroundColor: '#e0e0e6'}}
            inputContainerStyle={{backgroundColor: '#e0e0e6',borderRadius:10}}
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

ScheduleScreen.navigationOptions = () => ({
  title: 'Aikataulut',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 0,
    position: 'relative',
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
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    paddingLeft: 10,
    paddingRight: 10,
  },
  title_text: {
    textAlign: 'left',
    fontWeight: 'bold',
    flexGrow: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: iosColors.black,
  },
  searchButton: {
    borderWidth: 0.5,
    borderColor: iosColors.grey,
    borderRadius: 5,
    backgroundColor: '#fefefe',
    flexGrow: 0,
    padding: 6,
  },
  closeButton: {
    padding: 6,
    backgroundColor: '#ededed',
  },
  searchIcon: {
    height: 20,
    width: 20,
  },
  closeIcon: {
    height: 15,
    width: 15,
  },
  listItem: {
    borderBottomWidth: 1,
    borderColor: '#ededed',
  },
  kidItem_first: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: iosColors.grey,
  },
  kidButton: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kidButton_text: {
    color: iosColors.black,
    fontSize: 18,
    textAlign: 'left',
    paddingBottom: 3,
  }
});

export default ScheduleScreen;