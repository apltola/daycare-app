import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { apiRoot } from '../util';
import useGlobalHook from '../store';

const KidListScreen = () => {
  const [globalState, globalActions] = useGlobalHook();
  const [kids, setKids] = useState([]);
  const [kidsFiltered, setKidsFiltered] = useState(true);

  const fetchKids = async () => {
    try {
      const res = await axios.get(`${apiRoot}/child/all`);
      const kids = res.data;
      //console.log(kids);
      setKids(prev => kids);
    } catch(err) {
      console.error(err);
    }
  }

  const renderKids = p_kids => {
    if (p_kids.length === 0) return null;
    const kids = kidsFiltered
      ? p_kids.filter(kid => kid.childGroup.id === globalState.auth.groupId)
      : p_kids;

    return (
      kids.map(kid => {
        return (
          <View key={kid.id} style={styles.kidView}>
            <Text>
              name: {kid.firstName}
            </Text>
            <Text>
              groupId: {kid.childGroup.id}
            </Text>
            <Text>
              groupName: {kid.childGroup.name}
            </Text>
          </View>
        );
      })
    );
  }

  useEffect(() => {
    fetchKids();
  }, []);

  return (
    <View>
      <View style={styles.filterButtonsContainer}>
        <TouchableOpacity
          onPress={() => setKidsFiltered(prev => false)}
          style={kidsFiltered ? styles.filterButton : [styles.filterButton, styles.filterButtonSelected]}
        >
          <Text style={kidsFiltered ? styles.btnText : styles.btnTextSelected}>
            Kaikki muksut
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setKidsFiltered(prev => true)}
          style={kidsFiltered ? [styles.filterButton, styles.filterButtonSelected]: styles.filterButton}
        >
          <Text style={kidsFiltered ? styles.btnTextSelected : styles.btnText}>
            Omat muksut
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {renderKids(kids)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  kidView: {
    padding: 5
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 10,
    //borderWidth: 1,
    //borderColor: 'black'
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#147efb',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  filterButtonSelected: {
    backgroundColor: '#147efb',
  },
  btnTextSelected: {
    color: 'white',
    fontSize: 16,
  },
  btnText: {
    color: '#147efb',
    fontSize: 16,
  }
});

export default KidListScreen;