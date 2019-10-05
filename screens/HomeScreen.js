import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, DatePickerIOS, Image, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import DateTimePicker from "react-native-modal-datetime-picker";
import useGlobalHook from '../store';
import Header from '../components/Header';
import { formatDateString, iosColors, customColors } from '../util';
import orderBy from 'lodash/orderBy';

const Kid = ({ kid }) => {
  const [kidPresent, setKidPresent] = useState(false);

  return (
    <View style={styles.kidItem}>
      <View style={{flexDirection:'row'}}>
        <View style={styles.kidItem_left}>
          <Text style={styles.kidName}>
            {kid.firstName}
          </Text>
          <Text style={styles.kidArrival}>
            Tuloaika: {kid.arrival.substring(0, 5)}
          </Text>
        </View>
        <View style={styles.kidItem_right}>
          <Text style={{color:iosColors.black,textAlign:'center',}}>
            Paikalla
          </Text>
          <View style={styles.presentButtonContainer}>
            <TouchableOpacity
              onPress={() => setKidPresent(false)}
              style={[styles.presentButton, {
                backgroundColor: kidPresent ? '#e0e0e6' : iosColors.red,
                borderBottomLeftRadius: 10,
                borderTopLeftRadius: 10,
              }]}
            >
              <Icon
                name='times'
                type='font-awesome'
                size={20}
                color='white'
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setKidPresent(true)}
              style={[styles.presentButton, {
                backgroundColor: kidPresent ? iosColors.darkGreen : '#e0e0e6',
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }]}
            >
              <Icon
                name='check'
                type='font-awesome'
                size={20}
                color='white'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

function HomeScreen() {
  const [globalState, globalActions] = useGlobalHook();
  const [kids, setKids] = useState([]);
  const [kidsFiltered, setKidsFiltered] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  this._scrollViewRef = React.createRef();

  const renderKids = kids => {
    if (kids.length === 0) return (
      <View>
        <Text style={{
          //fontSize: 16,
          color: iosColors.black,
          textAlign: 'center',
          paddingVertical: 20,
        }}>
          Ei tietoja saapuvista muksuista
        </Text>
      </View>
    );

    const sortedKids = orderBy(kids, ['arrival'], ['asc']);
    return sortedKids.map(kid => {
      return <Kid kid={kid} />
    });
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
          <Icon
            name='chevron-down'
            type='font-awesome'
            size={15}
            color={iosColors.black}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.filterButtonsContainer}>
        <TouchableOpacity
          onPress={() => {
            setKidsFiltered(() => false);
            this._scrollViewRef.getNode && this._scrollViewRef.getNode().scrollTo({x: 0, y: 0, animated: false});
          }}
          style={kidsFiltered ? [styles.filterButton, styles.filterButton_left] : [styles.filterButton, styles.filterButtonSelected, styles.filterButton_left]}
        >
          <Text style={kidsFiltered ? styles.filterButtonText : styles.filterButtonText_selected}>
            Kaikki muksut
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setKidsFiltered(() => true)
            this._scrollViewRef.getNode && this._scrollViewRef.getNode().scrollTo({x: 0, y: 0, animated: false});
          }}
          style={kidsFiltered ? [styles.filterButton, styles.filterButton_right, styles.filterButtonSelected]: [styles.filterButton, styles.filterButton_right]}
        >
          <Text style={kidsFiltered ? styles.filterButtonText_selected : styles.filterButtonText}>
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

HomeScreen.navigationOptions = ({ navigation }) => ({
  title: 'Etusivu'
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  scrollView: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: customColors.lightGrey,
  },
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateButton: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ededed',
    borderRadius: 10,
    backgroundColor: '#ededed',
  },
  dateButtonTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: iosColors.black,
    paddingRight: 5,
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
    justifyContent: 'center',
    //borderWidth: 1,
  },
  kidItem_right: {
    flex: 1,
    //borderWidth: 1,
  },
  kidName: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'left',
    color: iosColors.black,
  },
  kidArrival: {
    paddingTop: 3,
    color: iosColors.black,
  },
  presentButtonContainer: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  presentButton: {
    flex: 1,
    paddingVertical: 8,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterButton: {
    //flex: 1,
    alignItems: 'center',
    //borderWidth: 1,
    //borderColor: '#147efb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    //borderBottomColor: 'transparent',
    //borderBottomWidth: 2,
    borderRadius: 10,
  },
  filterButtonSelected: {
    backgroundColor: customColors.lightGrey,
    //borderBottomWidth: 2,
    //borderBottomColor: customColors.lightGrey,
  },
  filterButton_left: {
    //borderTopLeftRadius: 5,
    //borderBottomLeftRadius: 5,
  },
  filterButton_right: {
    //borderTopRightRadius: 5,
    //borderBottomRightRadius: 5,
  },
  filterButtonText: {
    //color: '#147efb',
    color: iosColors.black,
    //fontSize: 16,
    //borderBottomWidth: 2,
  },
  filterButtonText_selected: {
    //color: 'white',
    color: iosColors.black,
    //fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderColor: customColors.lightGrey,
  },
});

export default HomeScreen;