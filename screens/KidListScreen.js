import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, DatePickerIOS, Image, Button } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import axios from 'axios';
import useGlobalHook from '../store';
import KidList from '../components/KidList';
import IsPresentButton from '../components/IsPresentButton';
import Header from '../components/Header';
import { formatDateString, iosColors } from '../util';
import orderBy from 'lodash/orderBy';

function KidListScreen() {
  const [globalState, globalActions] = useGlobalHook();
  const [kids, setKids] = useState([]);
  const [kidsFiltered, setKidsFiltered] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  this._scrollViewRef = React.createRef();

  const renderKids = kids => {
    if (kids.length === 0) return null;

    const sortedKids = orderBy(kids, ['arrival'], ['asc']);
    return sortedKids.map((kid, idx) => {
      const style = idx === 0 ? styles.kidItem_first : styles.kidItem;

      return (
        <View style={style}>
          <View style={{display:'flex',flexDirection:'row'}}>
            <View style={styles.kidItem_left}>
              <Text style={styles.kidName}>
                {kid.firstName}
              </Text>
              <Text style={styles.kidArrival}>
                Tuloaika: {kid.arrival.substring(0, 5)}
              </Text>
            </View>
            <View style={styles.kidItem_right}>
              <TouchableOpacity
                style={styles.isPresentButton}
                onPress={setKidPresent}
              >
                <Text style={{textTransform:'uppercase',color:'white',fontWeight:'bold'}}>
                  Paikalla
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    });
  }

  const setKidPresent = (kid = {}) => {
    console.log('TO BE DONE');
  }

  const onDatePicked = date => {
    setShowDatePicker(() => false);
    setDate(() => date);
  }
  
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
          <Text style={styles.dateButtonTxt}>
            {formatDateString(date, 'dd.mm.yyyy')}
          </Text>
        </TouchableOpacity>
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

      <DateTimePicker
        date={date}
        isVisible={showDatePicker}
        onConfirm={onDatePicked}
        onCancel={() => setShowDatePicker(false)}
        mode="date"
        cancelTextIOS="Peruuta"
        confirmTextIOS="Ok"
        titleIOS={'Valitse päivä'}
        />
    </View>
  );
}

KidListScreen.navigationOptions = ({ navigation }) => ({
  title: 'Etusivu'
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  scrollView: {
    //paddingLeft: 10,
    //paddingRight: 10,
    marginTop: 20
  },
  kidItem_first: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ededed',
    padding: 20
  },
  kidItem: {
    borderBottomWidth: 1,
    borderColor: '#ededed',
    padding: 20,
  },
  kidItem_left: {
    flex: 1,
  },
  kidItem_right: {
    flex: 1,
    //borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  kidName: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'left'
  },
  kidArrival: {
    paddingTop: 3,
    fontSize: 16,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateButton: {
    width: 200,
    alignItems: 'center',
    //backgroundColor: iosColors.grey,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: iosColors.grey,
    borderRadius: 4,
    //paddingLeft: 10,
    //paddingRight: 10,
  },
  dateButtonTxt: {
    fontSize: 20,
    //color: 'white',
    fontWeight: 'bold'
  },
  isPresentButton: {
    borderWidth: 1,
    borderColor: iosColors.green,
    backgroundColor: iosColors.darkGreen,
    borderRadius: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 18,
    paddingRight: 18,
  }
});

export default KidListScreen;