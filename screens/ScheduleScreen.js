import React, { useState, useEffect } from 'react';
import useGlobalHook from '../store';
import { StyleSheet, View, Text, Animated, Image, TextInput} from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { iosColors } from '../util';


export default ScheduleScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('kid');

  const renderList = () => {
    let arr = null
    if (!showSearchBar) {
      arr = globalState.allKids;
    } else {
      if (searchTerm === '') {
        arr = globalState.allKids;
      } else {
        if (searchFilter === 'kid') {
          arr = globalState.allKids.filter(kid => kid.firstName.toUpperCase().includes(searchTerm.toUpperCase()))
        } else {
          arr = globalState.allKids.filter(kid => kid.childgroup.name.toUpperCase().includes(searchTerm.toUpperCase()))
        }
      }
    }

    return arr.map(kid => {
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
    })
  }

  return (
    <View style={styles.container}>

      {showSearchBar &&
        <View style={styles.searchBar}>
          <View style={styles.searchBar_top}>
            <TextInput
              style={styles.searchInput}
              onChangeText={text => setSearchTerm(() => text)}
              autoFocus={true}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSearchBar(() => false)}
            >
              {/* <Image
                style={styles.closeIcon}
                source={require('../assets/close.png')}
              /> */}
              <Icon
                name="close"
                type="material"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar_bottom}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setSearchFilter(() => 'kid')}
            >
              <Text style={searchFilter === 'kid' ? styles.filterButtonSelected_text : styles.filterButton_text}>
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
      }

      <Animated.ScrollView
        contentContainerStyle={{paddingTop: 20}}
        style={styles.scrollView}
      >
        {!showSearchBar &&
          <View style={styles.titleContainer}>
            <Text style={styles.title_text}>
              Avaa muksun kalenteri
            </Text>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => setShowSearchBar(() => true)}
            >
              {/* <Image
                style={styles.searchIcon}
                source={require('../assets/search.png')}
              /> */}
              <Icon
                name="search"
                type="material"
              />
            </TouchableOpacity>
          </View>
        }

        <View style={{paddingTop: showSearchBar ? 0 : 20}}>
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
  searchBar: {
    backgroundColor: '#ededed',
    paddingTop: 28,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  searchBar_top: {
    display: 'flex',
    flexDirection: 'row',
  },
  searchBar_bottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 15,
  },
  searchInput: {
    flex: 1,
    padding: 7,
    fontSize: 18,
    borderRadius: 3,
    color: 'white',
    backgroundColor: '#bfbfbf',
    marginRight: 15
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
    padding: 6,
  },
  closeButton: {
    padding: 6,
    //borderWidth: 0.5,
    //borderColor: iosColors.grey,
    //borderRadius: 5,
    //backgroundColor: '#fefefe',
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