import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, DatePickerIOS, Image, Button } from 'react-native';
import axios from 'axios';
import { apiRoot } from '../util';
import useGlobalHook from '../store';
import KidList from '../components/KidList';
import IsPresentButton from '../components/IsPresentButton';
import Header from '../components/Header';

function KidListScreen() {
  const [globalState, globalActions] = useGlobalHook();
  const [kids, setKids] = useState([]);
  const [kidsFiltered, setKidsFiltered] = useState(true);
  const [date, setDate] = useState(new Date("2019/09/23"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  this._scrollViewRef = React.createRef();

  const renderKids = kids => {
    if (kids.length === 0) return null;
    /* const kids = kidsFiltered
    ? p_kids.filter(kid => kid.childGroup.id === globalState.auth.groupId)
    : p_kids; */

    return <KidList
              kids={kids}
              buttonCb={ kid => <IsPresentButton kid={kid} /> }
            />
  }

  const onDateChange = d => {
    console.log('DATE CHANGE!!!');
    console.log(d);
    setDate(prev => d);
  }

  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    return (
      <DatePickerIOS
        date={date}
        onDateChange={onDateChange}
        mode="date"
      />
    );
  }

  const getIconSource = () => {
    if (showDatePicker) {
      return require('../assets/chevron_up.png');
    } else {
      return require('../assets/chevron_down.png');
    }
  }

  /* useEffect(() => {
    globalActions.fetchKidsForDate(date);
    return () => {};
  }, []) */
  
  useEffect(() => {
    globalActions.fetchKidsForDate(date);
  }, [date])

  return (
    <View style={styles.container}>
      <Header title="kidTracker_3000" />
      <View style={styles.dateButtonContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(prev => !prev)}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.dateButtonTxt}>
              {date.toLocaleDateString()}
            </Text>
            <Image
              source={getIconSource()}
              style={{ height: 20, width: 20, marginLeft: 10}}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* <View>
        <Button
          title='juukelibutton'
          onPress={() => globalActions.fetchKidsForDate(date)}
        />
      </View> */}
      <View style={styles.datePickerContainer}>
        {renderDatePicker()}
      </View>
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
        {renderKids(globalState.kidsForDate)}
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
  },
  dateButtonContainer: {
    //borderWidth: 1,
    //borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20
  },
  dateButton: {
    //borderWidth: 1,
    //borderColor: 'black',
    width: 200,
    alignItems: 'center',
  },
  dateButtonTxt: {
    fontSize: 24
  },
});

export default KidListScreen;