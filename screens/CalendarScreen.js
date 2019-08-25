import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  DatePickerIOS,
} from 'react-native';
import { initMonth, parseRange, getDays, dateIsBetween, dateIsOut, getDateWithoutTime, formatDateString, iosColors } from '../util';
import t from 'timestamp-utils'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const DAY_LABELS = ['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU'];
const MONTH_LABELS = ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];

const CalendarScreen = () => {
  const initialDateData = {...initMonth(), ...parseRange()}
  //console.log('initialDateData => ', initialDateData);
  const [firstDateToShow, setFirstDateToShow] = useState(initialDateData.firstDayToDisplay);
  const [firstMonthDay, setFirstMonthDay] = useState(initialDateData.firstMonthDay);
  const [lastMonthDay, setLastMonthDay] = useState(initialDateData.lastMonthDay);
  const [month, setMonth] = useState(initialDateData.month);
  const [year, setYear] = useState(initialDateData.year);
  const [selectedDays, setSelectedDays] = useState([]);


  getDayClassNames = (day, elementType) => {
    //const { firstMonthDay, lastMonthDay, startDate, endDate } = this.state
    //const { disableDates } = this.props
    //const sDate = getDateWithoutTime(startDate)
    //const eDate = getDateWithoutTime(endDate)
    let conditions = {};
    if (elementType === 'view') {
      conditions = {
        'day': true,
        'dayToday': day === getDateWithoutTime(new Date().getTime()),
        'daySelected': selectedDays.includes(day),
        'dayOutOfMonth': dateIsOut(day, firstMonthDay, lastMonthDay),
        //'day-inside-selection': dateIsBetween(day, sDate, eDate),
        //'day-selected': !endDate && (sDate === day),
        //'day-start-selection': endDate && (sDate === day),
        //'day-end-selection': endDate && (eDate === day),
        //'day-disabled': disableDates(day),
        [`day_${day}`]: true
      }
    } else if (elementType === 'text') {
      conditions = {
        'day_text': true,
        'dayToday_text': day === getDateWithoutTime(new Date().getTime()),
        'daySelected_text': selectedDays.includes(day),
        'dayOutOfMonth_text': dateIsOut(day, firstMonthDay, lastMonthDay),
        //'day-inside-selection': dateIsBetween(day, sDate, eDate),
        //'day-selected': !endDate && (sDate === day),
        //'day-start-selection': endDate && (sDate === day),
        //'day-end-selection': endDate && (eDate === day),
        //'day-disabled': disableDates(day),
        [`day_${day}_text`]: true
      }
    }

    return Object.entries(conditions).map(i => i[1] ? styles[i[0]] : null);
  }

  const onDaySelect = day => {
    if (!selectedDays.includes(day)) {
      setSelectedDays(prev => [...selectedDays, day]);
    } else {
      const juukeli = selectedDays.filter(i => i !== day);
      setSelectedDays(prev => juukeli);
    }
  }

  const onTimeChange = p_time => {
    const time = new Date(p_time);
    console.log('time => ', time);
    /* const date = time.getDate();
    console.log('date => ', date);
    const day = time.getDay();
    console.log('day => ', day);
    const hours = time.getHours(time);
    console.log('hours => ', hours);
    const minutes = time.getMinutes(time);
    console.log('minutes => ', minutes);
    const month = time.getMonth(time);
    console.log('month => ', month);
    const time2 = time.getTime(time);
    console.log('time2 => ', time2);
    const year = time.getFullYear(year);
    console.log('year => ', year);
    const zone = time.getTimezoneOffset();
    console.log('zone => ', zone); */

    const data = {
      arrive: {
        date: {}
      }
    }
    //console.log(day.getTime());
  }

  const formatSelectedDaysTitle = () => {
    if (selectedDays.length === 0) return null;

    const formattedDays = selectedDays.map(day => {
      return formatDateString(day);
    })
    const str = formattedDays.join(', ')
    return str;
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
              /* <View
                key={day}
                style={getDayClassNames(day, 'view')}
              >
                <Text style={getDayClassNames(day, 'text')}>
                  {parseInt(t.getDay(day), 10)}
                </Text>
              </View> */
              <TouchableOpacity
                key={day}
                style={getDayClassNames(day, 'view')}
                onPress={() => onDaySelect(day)}
              >
                <Text style={getDayClassNames(day, 'text')}>
                  {parseInt(t.getDay(day), 10)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <View style={styles.timeInputContainer}>
        <Text style={styles.selectedDaysHeader}>
          {formatSelectedDaysTitle()}
        </Text>
        {/* <DatePickerIOS
          date={new Date()}
          mode='time'
          onDateChange={onTimeChange}
        /> */}
      </View>
      <Text>
        {JSON.stringify(selectedDays, null, 2)}
      </Text>
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
    //borderWidth: 1,
  },
  daySelected: {
    backgroundColor: iosColors.lightBlue,
  },
  daySelected_text: {
    color: 'white',
    fontWeight: 'bold'
  },
  timeInputContainer: {
    borderWidth: 1,
  }
});


export default CalendarScreen;