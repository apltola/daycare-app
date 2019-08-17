import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRoot } from '../util';
import useGlobalHook from '../store';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Dimensions
} from 'react-native';
import { initMonth, parseRange, getDays, dateIsBetween, dateIsOut, getDateWithoutTime } from '../util';
import t from 'timestamp-utils'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const CalendarScreen = () => {
  const setti = {...initMonth(), ...parseRange()}
  console.log('setti => ', setti);
  const [firstDateToShow, setFirstDateToShow] = useState(setti.firstDayToDisplay);
  const [firstMonthDay, setFirstMonthDay] = useState(setti.firstMonthDay);
  const [lastMonthDay, setLastMonthDay] = useState(setti.lastMonthDay);
  const [month, setMonth] = useState(setti.month);
  const [year, setYear] = useState(setti.year);


  getDayClassNames = (day, element) => {
    //const { firstMonthDay, lastMonthDay, startDate, endDate } = this.state
    //const { disableDates } = this.props
    //const sDate = getDateWithoutTime(startDate)
    //const eDate = getDateWithoutTime(endDate)
    let conditions = {};
    if (element === 'view') {
      conditions = {
        //'day-disabled': disableDates(day),
        'day': true,
        'dayToday': day === getDateWithoutTime(new Date().getTime()),
        //'day-inside-selection': dateIsBetween(day, sDate, eDate),
        'dayOutOfMonth': dateIsOut(day, firstMonthDay, lastMonthDay),
        //'day-selected': !endDate && (sDate === day),
        //'day-start-selection': endDate && (sDate === day),
        //'day-end-selection': endDate && (eDate === day),
        [`day_${day}`]: true
      }
    } else if (element === 'text') {
      conditions = {
        //'day-disabled': disableDates(day),
        'day_text': true,
        'dayToday_text': day === getDateWithoutTime(new Date().getTime()),
        //'day-inside-selection': dateIsBetween(day, sDate, eDate),
        'dayOutOfMonth_text': dateIsOut(day, firstMonthDay, lastMonthDay),
        //'day-selected': !endDate && (sDate === day),
        //'day-start-selection': endDate && (sDate === day),
        //'day-end-selection': endDate && (eDate === day),
        [`day_${day}`]: true
      }
    }


    return Object.entries(conditions).map(i => i[1] ? styles[i[0]] : null)
  }

  return (
    <View>
      <Text>KALENTERIII!!!</Text>
      <View styles={styles.calendarWrapper}>
        <View style={styles.calendar}>
          {getDays(firstDateToShow).map(day => {
            return (
              <View
                key={day}
                style={getDayClassNames(day, 'view')}
              >
                <Text style={getDayClassNames(day, 'text')}>
                  {parseInt(t.getDay(day), 10)}
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    //borderWidth: 1,
    //borderColor: 'red',
    //borderWidth: 1
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  day: {
    padding: 0,
    width: (SCREEN_WIDTH/7.05)-(20/7),
    height: 50,
    borderTopWidth: 0.5,
  },
  day_text: {
    fontSize: 18,
    margin: 10
  },
  dayOutOfMonth: {
    
  },
  dayOutOfMonth_text: {
    opacity: 0.5,
  },
  dayToday: {
    borderWidth: 1,
    borderColor: 'red'
  },
  scrollView: {

  },
  calendarWrapper: {
    alignContent: 'center',
  },

});

export default CalendarScreen;