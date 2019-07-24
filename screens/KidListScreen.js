import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TouchableHighlight, Animated } from 'react-native';
import axios from 'axios';
import { apiRoot } from '../util';
import useGlobalHook from '../store';
import KidList from '../components/KidList';
import IsPresentButton from '../components/IsPresentButton';

function KidListScreen() {
  const [globalState, globalActions] = useGlobalHook();
  const [kids, setKids] = useState([]);
  const [kidsFiltered, setKidsFiltered] = useState(true);
  this._scrollViewRef = React.createRef();

  /* const fetchKids = async () => {
    try {
      const res = await axios.get(`${apiRoot}/child/all`);
      const kids = res.data;
      //console.log(kids);
      console.log('FETCH!!!')
      setKids(prev => kids);
    } catch(err) {
      console.error(err);
    }
  } */

  /* const setKidPresent = kid => {
    try {
      console.log(kid.firstName);
    } catch(err) {
      console.err(err);
    }
  } */

  const renderKids = p_kids => {
    if (p_kids.length === 0) return null;
    const kids = kidsFiltered
      ? p_kids.filter(kid => kid.childGroup.id === globalState.auth.groupId)
      : p_kids;

    return <KidList
              kids={kids}
              returnButton={ kid => <IsPresentButton kid={kid} /> }
            />
  }

  useEffect(() => {
    //fetchKids();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterButtonsContainer}>
        <TouchableOpacity
          onPress={() => {
            setKidsFiltered(prev => false);
            this._scrollViewRef.getNode().scrollTo({x: 0, y: 0, animated: false});
          }}
          style={kidsFiltered ? styles.filterButton : [styles.filterButton, styles.filterButtonSelected]}
        >
          <Text style={kidsFiltered ? styles.btnText : styles.btnTextSelected}>
            Kaikki muksut
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setKidsFiltered(prev => true)
            this._scrollViewRef.getNode().scrollTo({x: 0, y: 0, animated: false});
          }
        }
          style={kidsFiltered ? [styles.filterButton, styles.filterButtonSelected]: styles.filterButton}
        >
          <Text style={kidsFiltered ? styles.btnTextSelected : styles.btnText}>
            Omat muksut
          </Text>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        ref={e => this._scrollViewRef = e}
        style={styles.scrollView}
      >
        {renderKids(globalState.allKids)}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //borderWidth: 1,
    //borderColor: 'red',
    flex: 1,
    flexDirection: 'column'
  },
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20
    //borderWidth: 2,
    //borderColor: 'goldenrod',
  },
  kidItem: {
    flexDirection: 'row',
    padding: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#d1d5da',
  },
  kidItemLeft: {
    flex: 1,
  },
  kidItemRight: {
    flex: 1,
    //borderWidth: 1,
    //borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  kidName: {
    fontSize: 25,
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
  },
  presentBtn: {
    borderColor: 'black',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 3
  }
});

export default KidListScreen;