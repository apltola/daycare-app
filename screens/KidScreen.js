import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import useGlobalHook from '../store';
import Header from '../components/Header';
import { iosColors } from '../util';

const KidScreen = ({ navigation }) => {
  const [globalState, globalActions] = useGlobalHook();

  const renderList = () => {
    if (!globalState.allKids || globalState.allKids.length === 0) return null;

    const arr = globalState.allKids;
    return arr.map((kid, idx) => {
      const _styles = idx === 0 ? [styles.listItem_first, styles.listItem] : [styles.listItem];

      return (
        <View style={styles.listItem}>
          <View style={styles.listItem_left}>
            <View style={{display:'flex', flexDirection: 'row',paddingBottom: 5}}>
              <Text style={{fontWeight: 'bold', textTransform: 'uppercase', flex: 1}}>
                {kid.firstName}
              </Text>
              <Text style={{flex: 1}}>
                Syntymäpäivä: {kid.birthday || '–'}
              </Text>
            </View>
            <Text>
              {kid.childgroup.name}
            </Text>
          </View>
          <View style={styles.listItem_right}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('editKid')}
            >
              <View style={styles.buttonContent}>
                <Icon
                  name="edit"
                  type="font-awesome"
                  color="white"
                />
                <Text style={styles.buttonText}>MUOKKAA</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => console.log('POISTA')}
            >
              <View style={styles.buttonContent}>
                <Icon
                  name="trash"
                  type="font-awesome"
                  color="white"
                />
                <Text style={styles.buttonText}>POISTA</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    })
  }

  return (
    <View style={styles.container}>
      {/* <Header title="Muksut" noMargin={true} /> */}

      <Animated.ScrollView
        contentContainerStyle={{paddingTop: 20}}
      >
        {renderList()}
      </Animated.ScrollView>
    </View>
  );
}

KidScreen.navigationOptions = ({ navigation }) => ({
  title: 'Muksut'
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: 'column',
  },
  listItem_left: {
    //flex: 1,
  },
  listItem_right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  editButton: {
    backgroundColor: iosColors.darkGreen,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: iosColors.red,
    borderRadius: 4,
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    //paddingTop: 8,
  }
});

export default KidScreen;