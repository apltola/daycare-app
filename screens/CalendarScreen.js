import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { initMonth, parseRange, getDays, dateIsBetween, dateIsOut, getDateWithoutTime, formatDateString, iosColors } from '../util';
import t from 'timestamp-utils';
import DateTimePicker from "react-native-modal-datetime-picker";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const DAY_LABELS = ['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU'];
const MONTH_LABELS = ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];

const CalendarScreen = props => {
  const initialDateData = {...initMonth(), ...parseRange()}
  const [firstDateToShow, setFirstDateToShow] = useState(initialDateData.firstDayToDisplay);
  const [firstMonthDay, setFirstMonthDay] = useState(initialDateData.firstMonthDay);
  const [lastMonthDay, setLastMonthDay] = useState(initialDateData.lastMonthDay);
  const [month, setMonth] = useState(initialDateData.month);
  const [year, setYear] = useState(initialDateData.year);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState('');
  const [postData, setPostData] = useState([]);
  const [arrivalTime, setArrivalTime] = useState(0);
  const [departureTime, setDepartureTime] = useState(0);
  const [daysWithArrival, setDaysWithArrival] = useState(0);
  const [daysWithDeparture, setDaysWithDeparture] = useState(0);  

  /* Navigation props */
  const kid = props.navigation.getParam('kid', {});

  getCalendarClassNames = (day, elementType) => {
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

    //console.log(day.getTime());
  }

  const formatSelectedDaysTitle = () => {
    if (selectedDays.length === 0) return '';

    const formattedDays = selectedDays.map(day => {
      return formatDateString(day, 'dd.mm.yyyy');
    });

    return `Valitut päivät: ${formattedDays.join(', ')}`;
    //return formattedDays.join(', ');
  }

  const onTimeButtonPress = type => {
    setTimePickerTarget(() => type);
    setIsTimePickerVisible(() => true);
  }

  const onTimePicked = time => {
    console.log('picked => ', time.getTime());
    console.log('pickedDate => ', time.getDate());
    console.log('pickedHours', time.getHours());
    console.log('pickedMinutes', time.getMinutes());
    let foo = t.addHours(selectedDays[0], time.getHours());
    let baz = t.addMinutes(foo, time.getMinutes())
    console.log('baz => ', baz);

    setIsTimePickerVisible(() => false);

    /* 
      Jos tullaan tähän funktioon ja daysWithArrival = daysWithDeparture,
      tiedetään että pitää luoda uusia alkoita postData tauluun.
      Jos tullaan tähän funktioon ja ne on eri,
      tiedetään että pitää etsiä jo luotua alkiota indeksillä postData taulusta
    */

    if (daysWithArrival === daysWithDeparture) {
      const arr = selectedDays.map(day => {
        let data = {
          temp_id: day,
          child: kid,
          date: formatDateString(day, 'yyyy-mm-dd'),
        }
        const withHours = t.addHours(day, time.getHours());
        const withHoursAndMinutes = t.addMinutes(withHours, time.getMinutes());
        if (timePickerTarget === 'arrival') {
          data.arrive = withHoursAndMinutes;
          setDaysWithArrival(prev => prev + selectedDays.length)
        } else {
          data.departure = withHoursAndMinutes;
          setDaysWithDeparture(prev => prev + selectedDays.length)
        }
        
        return data;
      })

      setPostData(prev => [...prev, arr]);
    } else {
      selectedDays.forEach(selectedDay => {
        const idx = postData.findIndex(i => i.temp_id === selectedDay);

        // päivälle on laitettu jo saapumis-/lähtöaika -> pitää laittaa puuttuva aika
        if (idx > -1) {
          const withHours = t.addHours(day, time.getHours());
          const withHoursAndMinutes = t.addMinutes(withHours, time.getMinutes());
          if (postData[idx].arrive) {
            postData[idx].departure = withHoursAndMinutes;
          } else if (postData[idx].departure) {
            postData[idx].arrive = withHoursAndMinutes;
          }
        }
      })
    }
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
              <TouchableOpacity
                key={day}
                style={getCalendarClassNames(day, 'view')}
                onPress={() => onDaySelect(day)}
              >
                <Text style={getCalendarClassNames(day, 'text')}>
                  {parseInt(t.getDay(day), 10)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <View style={styles.timeInputContainer}>
          {/* <Text style={styles.selectedDaysTitle}>
            {formatSelectedDaysTitle()}
          </Text> */}
          {selectedDays.length > 0 &&
          <View style={styles.timeButtonsContainer}>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => onTimeButtonPress('arrival')}
              >
              <Text style={styles.timeButton_text}>Aseta saapumisaika</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => onTimeButtonPress('departure')}
            >
              <Text style={styles.timeButton_text}>Aseta lähtöaika</Text>
            </TouchableOpacity>
          </View>}
      </View>

      <View style={{display: 'flex', flexDirection: 'column'}}>
        <Animated.ScrollView
          style={{height: 115, borderWidth: 1, borderColor: 'red'}}
        >
          <View>
            <Text>
              {JSON.stringify(selectedDays, null, 2)}
            </Text>
            <Text>
              {JSON.stringify(postData, null, 2)}
            </Text>
            <Text>
              daysWithArrival: {JSON.stringify(daysWithArrival, null, 2)}
            </Text>
            <Text>
              daysWithDeparture: {JSON.stringify(daysWithDeparture, null, 2)}
            </Text>
            <Text>
              timePickerTarget: {JSON.stringify(timePickerTarget, null, 2)}
            </Text>
          </View>
        </Animated.ScrollView>      
      </View>

      <DateTimePicker
        isVisible={isTimePickerVisible}
        onConfirm={onTimePicked}
        onCancel={() => setIsTimePickerVisible(false)}
        mode="time"
        cancelTextIOS="Peruuta"
        confirmTextIOS="Ok"
        titleIOS={timePickerTarget === 'arrival' ? 'Aseta saapumisaika' : 'Aseta lähtöaika'}
      />
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
  },
  selectedDaysTitle: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  timeButtonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    //paddingTop: 10
  },
  timeButton: {
    marginTop: 10,
    borderWidth: 1,
    display: 'flex',
    //width: SCREEN_WIDTH/2,
  },
  timeButton_text: {
    color: iosColors.darkBlue,
    fontSize: 20,
    textAlign: 'center',
  },
});


export default CalendarScreen;