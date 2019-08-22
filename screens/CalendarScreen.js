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
import { initMonth, parseRange, getDays, dateIsBetween, dateIsOut, getDateWithoutTime, iosColors } from '../util';
import t from 'timestamp-utils'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const DAY_LABELS = ['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU'];
const MONTH_LABELS = ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];

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
      <View style={styles.calendarContainer}>
        <View style={styles.dayLabels}>
          {DAY_LABELS.map(label => {
            return (
              <Text key={label} style={styles.dayLabel_text}>
                {label}
              </Text>
            )
          })}
        </View>
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
  calendarContainer: {
    //borderWidth: 2,
    borderColor: 'red',
    padding: 10,
    alignContent: 'center',
    alignItems: 'center',
  },
  dayLabels: {
    flexDirection: 'row',
    marginLeft: -1,
    marginBottom: 10
  },
  dayLabel_text: {
    width: (SCREEN_WIDTH/7.05)-(20/7),
    textAlign: 'center',
    //borderWidth: 0.5,
    borderColor: iosColors.grey,
  },
  calendar: {
    //borderWidth: 1,
    //borderColor: 'red',
    //borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //margin: 10,
  },
  day: {
    width: (SCREEN_WIDTH/7.05)-(20/7),
    height: 50,
    borderWidth: 0.5,
    borderColor: iosColors.grey,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  day_text: {
    fontSize: 18,
    //margin: 10,
    textAlign: 'center',
  },
  dayOutOfMonth: {
    
  },
  dayOutOfMonth_text: {
    opacity: 0.3,
  },
  dayToday: {
    //borderWidth: 1,
    //borderColor: 'red'
  },
  dayToday_text: {
    textAlign: 'center',
    color: iosColors.red,
    fontWeight: 'bold',
    borderWidth: 1,

  },
  scrollView: {

  },
  calendarWrapper: {
    alignContent: 'center',
  },

});


export default CalendarScreen;