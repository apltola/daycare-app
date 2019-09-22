import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import Button from '../components/Button';
import Dialog, { DialogContent, DialogFooter, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';
import t from 'timestamp-utils';
import DateTimePicker from "react-native-modal-datetime-picker";
import axios from 'axios';
import Spinner from '../components/Spinner';
import { initMonth, getDays, dateIsOut, getDateWithoutTime, formatDateString, iosColors, apiRoot } from '../util';
import union from 'lodash/union';
import globalStyles from '../util/globalStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const DAY_LABELS = ['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU'];
const MONTH_LABELS = ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];

const CalendarScreen = props => {
  const [kidSchedules, setKidSchedules] = useState([]);
  const [dateData, setDateData] = useState({...initMonth()});
  const [selectedDays, setSelectedDays] = useState([]);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState('');
  const [postData, setPostData] = useState([]);
  const [daysWithArrival, setDaysWithArrival] = useState([]);
  const [daysWithDeparture, setDaysWithDeparture] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [submitWasSuccessful, setSubmitWasSuccessful] = useState(false);

  /* Navigation props */
  const kid = props.navigation.getParam('kid', {});

  const fetchSchedules = async () => {
    const res = await axios.get(`${apiRoot}/schedule/child/${kid.id}`);
    const schedules = await res.data;
    setKidSchedules(() => schedules);
  }

  useEffect(() => {
    fetchSchedules();

    return () => {
      return setKidSchedules([]);
    };
  }, []);

  getCalendarClassNames = (day, elementType) => {
    //const { firstMonthDay, lastMonthDay, startDate, endDate } = this.state
    //const { disableDates } = this.props
    //const sDate = getDateWithoutTime(startDate)
    //const eDate = getDateWithoutTime(endDate)

    const dayHasSchedule = kidSchedules.findIndex(i => i.date === formatDateString(day, 'yyyy-mm-dd')) > -1;

    let conditions = {};
    if (elementType === 'view') {
      conditions = {
        'day': true,
        'dayToday': day === getDateWithoutTime(new Date().getTime()),
        'daySelected': selectedDays.includes(day),
        'dayOutOfMonth': dateIsOut(day, dateData.firstMonthDay, dateData.lastMonthDay),
        'dayWithSchedule': dayHasSchedule,
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
        'dayOutOfMonth_text': dateIsOut(day, dateData.firstMonthDay, dateData.lastMonthDay),
        'dayWithSchedule_text': dayHasSchedule,
        //'day-inside-selection': dateIsBetween(day, sDate, eDate),
        //'day-selected': !endDate && (sDate === day),
        //'day-start-selection': endDate && (sDate === day),
        //'day-end-selection': endDate && (eDate === day),
        //'day-disabled': disableDates(day),
        [`day_${day}_text`]: true
      }
    }

    const classList = Object.entries(conditions).map(i => i[1] ? styles[i[0]] : null);
    return classList;
  }

  const addDayToScheduledList = (day, type) => {
    const arr = type === 'arrival' ? daysWithArrival : daysWithDeparture;
    const idx = arr.findIndex(i => i === day);
    if (idx > -1) {
      return;
    } else {
      if (type === 'arrival') {
        return setDaysWithArrival(prev => [...prev, day])
      } else {
        return setDaysWithDeparture(prev => [...prev, day])
      }
    }
  }

  const getDaysWithSchedule = () => {
    let arr = daysWithArrival;
    daysWithDeparture.forEach(day => {
      const idx = arr.findIndex(i => i === day);
      if (idx === -1) {
        arr = [...arr, day];
      }
    })

    arr.sort();
    return arr;
  }

  const onDaySelect = day => {
    if (!selectedDays.includes(day)) {
      setSelectedDays(prev => [...prev, day]);
    } else {
      const filtered = selectedDays.filter(i => i !== day);
      setSelectedDays(() => filtered);
    }
  }

  const onTimeButtonPress = type => {
    setTimePickerTarget(() => type);
    setIsTimePickerVisible(() => true);
  }

  const onTimePicked = time => {
    setIsTimePickerVisible(() => false);

    const selectedDaysArr = selectedDays;
    selectedDaysArr.forEach(selectedDay => {
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const timeWithHours = t.addHours(selectedDay, hours);
      const timeWithHoursAndMin = t.addMinutes(timeWithHours, minutes);

      const dayHasArrival = daysWithArrival.findIndex(i => i === selectedDay) > -1;
      const dayHasDeparture = daysWithDeparture.findIndex(i => i === selectedDay) > -1;
      
      if (dayHasArrival || dayHasDeparture) {
        let postArr = postData;
        const idx = postArr.findIndex(i => i.temp_id === selectedDay);
        if (timePickerTarget === 'arrival') {
          postArr[idx].arrive = timeWithHoursAndMin;
          addDayToScheduledList(selectedDay, 'arrival');
        } else if (timePickerTarget === 'departure') {
          postArr[idx].departure = timeWithHoursAndMin;
          addDayToScheduledList(selectedDay, 'departure');
        }

        setPostData(() => postArr);
        
      } else {
        let data = {
          temp_id: selectedDay,
          child: kid,
          date: formatDateString(selectedDay, 'yyyy-mm-dd')
        }
        if (timePickerTarget === 'arrival') {
          data.arrive = timeWithHoursAndMin;
          addDayToScheduledList(selectedDay, 'arrival');
        } else if (timePickerTarget === 'departure') {
          data.departure = timeWithHoursAndMin;
          addDayToScheduledList(selectedDay, 'departure');
        }

        setPostData(prev => [...prev, data])
      }
    });
  }

  const changeMonth = monthOffset => {
    const fmd = dateData.firstMonthDay;
    const timestamp = t.addMonths(fmd, monthOffset);
    setDateData(() => initMonth(timestamp));
  }

  const renderCalendarNavigation = () => {
    let monthLabel = null;
    if (dateData.month[0] === '0') {
      monthLabel = MONTH_LABELS[dateData.month[1] - 1];
    } else {
      monthLabel = MONTH_LABELS[dateData.month - 1];
    }

    return (
      <View style={styles.calendarNavigation}>
        <TouchableOpacity
          style={{marginRight: 15}}
          onPress={() => changeMonth(-1)}
        >
          <Text style={{fontSize: 25, color: iosColors.darkBlue}}>
            {'<'}
          </Text>
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: iosColors.darkBlue, paddingTop: 2}}>
          {`${monthLabel} ${dateData.year}`}
        </Text>
        <TouchableOpacity
          style={{marginLeft: 15}}
          onPress={() => changeMonth(1)}
        >
          <Text style={{fontSize: 25, color: iosColors.darkBlue}}>
            {'>'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderTimeTable = () => {
    const arr1 = kidSchedules.map(i => new Date(i.date).getTime());
    const arr2 = getDaysWithSchedule();
    const arr3 = union(arr1, arr2);
    const today = new Date(formatDateString(new Date(), 'yyyy-mm-dd')).getTime();
    const daysWithSchedule = arr3.filter(i => i >= today);
    daysWithSchedule.sort();

    if (daysWithSchedule.length === 0) return null;

    return (
      <View style={styles.timeTable}>
        <View style={styles.timeTableRow}>
          <Text style={[styles.timeTableCol_left, {fontWeight: 'bold'}]}>
            Päivä
          </Text>
          <Text style={[styles.timeTableCol_mid, {fontWeight: 'bold'}]}>
            Saapumisaika
          </Text>
          <Text style={[styles.timeTableCol_right, {fontWeight: 'bold'}]}>
            Lähtöaika
          </Text>
        </View>
        {
          daysWithSchedule.map(day => {
            const dateStr = formatDateString(day, 'dd.mm.yyyy');
            let arrivalStr;
            let departureStr;
            let dayData;
            if (postData.findIndex(i => i.temp_id === day) === -1) {
              dayData = kidSchedules.find(item => new Date(item.date).getTime() === day);
              arrivalStr = dayData.arrive.substring(0,5);
              departureStr = dayData.departure.substring(0,5);
            } else {
              dayData = postData.find(item => item.temp_id === day);
              arrivalStr = formatDateString(dayData.arrive, 'hh:mm');
              departureStr = formatDateString(dayData.departure, 'hh:mm');
            }

            return (
              <View style={styles.timeTableRow}>
                <Text style={styles.timeTableCol_left}>
                  {dateStr}
                </Text>
                <Text style={styles.timeTableCol_mid}>
                  {arrivalStr || '-'}
                </Text>
                <Text style={styles.timeTableCol_right}>
                  {departureStr || '-'}
                </Text>
              </View>
            )
          })
        }
      </View>
    );
  }

  const renderSubmitButton = () => {
    const daysWithSchedule = getDaysWithSchedule();
    if (selectedDays.length === 0) {
      return null;
    };

    if (loading) {
      return <Spinner side="small" />;
    } else {
      return <Button onPress={onSubmit} style="primary" title="Tallenna" />
    }
  }

  const renderCheckmark = day => {
    const today = new Date(formatDateString(new Date(), 'yyyy-mm-dd')).getTime();
    if (day >= today) {
      const idx = kidSchedules.findIndex(i => i.date === formatDateString(day, 'yyyy-mm-dd'));
      if (idx > -1) {
        return (
          <Image
            style={styles.checkmark}
            source={require('../assets/checkmark.png')}
          />
        )
      }
    } else {
      return null;
    }
  }

  const onSubmit = async () => {
    setLoading(() => true);

    try {
      const res = await axios.post(`${apiRoot}/schedule/add/many`, postData);
      setRes(res);
      setLoading(() => false);
      setShowPopup(() => true);
      setSubmitWasSuccessful(() => true);
      await fetchSchedules();
      setSelectedDays([]);
    } catch (e) {
      setError(e);
      setSubmitWasSuccessful(() => false);
      setLoading(() => false);
      setShowPopup(() => true);
    }
  }

  return (
    <View style={{flex: 1}}>
      <Animated.ScrollView style={{flex: 1}}>
        <View style={styles.kidTitle}>
          <Text style={styles.kidTitle_text}>
            {`${kid.firstName}, ${kid.childgroup.name}`}
          </Text>
        </View>
        
        <View style={styles.calendarContainer}>
          {renderCalendarNavigation()}
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
            {getDays(dateData.firstDayToDisplay).map(day => {
              return (
                <TouchableOpacity
                  key={day}
                  style={getCalendarClassNames(day, 'view')}
                  onPress={() => onDaySelect(day)}
                  disabled={dateIsOut(day, dateData.firstMonthDay, dateData.lastMonthDay)}
                >
                  <Text style={getCalendarClassNames(day, 'text')}>
                    {parseInt(t.getDay(day), 10)}
                  </Text>
                  {renderCheckmark(day)}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View>
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
        
        {renderTimeTable()}
        
        <View style={{display: 'flex', alignItems: 'center', paddingTop: 20}}>
          {renderSubmitButton()}
        </View>

        <View style={{marginTop: 60}}>
          <Text>
            selectedDays: {JSON.stringify(selectedDays, null, 2)}
          </Text>
          <Text>
            postData: {JSON.stringify(postData, null, 2)}
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
          <Text>
            error: {JSON.stringify(error, null, 2)}
          </Text>
          {/* <Text>
            res: {JSON.stringify(res, null, 2)}
          </Text>
          <Text>
            kidSchedules: {JSON.stringify(kidSchedules, null, 2)}
          </Text> */}
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
        
        <Dialog
          visible={showPopup}
          onTouchOutside={() => setShowPopup(false)}
          dialogAnimation={new ScaleAnimation({ initialValue: 0, useNativeDriver: true })}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => setShowPopup(false)}
                textStyle={{color: iosColors.darkBlue, fontSize: 18}}
              />
            </DialogFooter>
          }
        >
          <DialogContent style={{paddingTop: 10}}>
            <Icon
              name={submitWasSuccessful ? 'check-circle' : 'exclamation-circle'}
              type='font-awesome'
              color={submitWasSuccessful ? iosColors.green : iosColors.red}
              size={60}
            />
            <Text style={{paddingTop:13, fontSize: 18, color: iosColors.black, textAlign: 'center'}}>
              {submitWasSuccessful ? 'Tallentaminen onnistui' : 'Tallentaminen epäonnistui!'}
            </Text>
            {
              !submitWasSuccessful &&
              <Text style={{paddingTop:13, fontSize: 18, color: iosColors.black, textAlign: 'center'}}>
                Yritä uudelleen.
              </Text>
            }
          </DialogContent>
        </Dialog>
      </Animated.ScrollView>
    </View>
  );
}

CalendarScreen.navigationOptions = () => ({

});

const styles = StyleSheet.create({
  kidTitle_text: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 18,
  },
  calendarNavigation: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarContainer: {
    borderColor: 'red',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 0,
    alignContent: 'center',
    alignItems: 'center',
  },
  dayLabels: {
    flexDirection: 'row',
    marginLeft: -1,
    marginBottom: 10,
    paddingTop: 20,
  },
  dayLabel_text: {
    width: (SCREEN_WIDTH/7.05)-(20/7),
    textAlign: 'center',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: (SCREEN_WIDTH/7.05)-(20/7),
    height: 50,
    borderWidth: 0.5,
    borderColor: iosColors.grey,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  day_text: {
    fontSize: 18,
    textAlign: 'center',
  },
  dayOutOfMonth: {
    
  },
  dayOutOfMonth_text: {
    opacity: 0.3,
  },
  dayToday: {

  },
  dayToday_text: {
    textAlign: 'center',
    color: iosColors.red,
    fontWeight: 'bold',
    padding: 5,
  },
  daySelected: {
    backgroundColor: iosColors.lightBlue,
  },
  daySelected_text: {
    color: 'white',
    fontWeight: 'bold'
  },
  dayWithSchedule_text: {

  },
  selectedDaysTitle: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  timeButtonsContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  timeButton: {
    display: 'flex',
  },
  timeButton_text: {
    color: iosColors.darkBlue,
    fontSize: 19,
    textAlign: 'center',
  },
  timeTable: {
    padding: 10,
    paddingTop: 30,
  },
  timeTableRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  timeTableCol_left: {
    width: 115,
    fontSize: 16,
    color: iosColors.black,
    marginBottom: 4,
  },
  timeTableCol_mid: {
    width: 125,
    fontSize: 16,
    color: iosColors.black,
    marginBottom: 4,
  },
  timeTableCol_right: {
    fontSize: 16,
    color: iosColors.black,
    marginBottom: 4,
  },
  checkmark: {
    width: 10,
    height: 10,
    position: 'absolute',
    right: 5,
    bottom: 5,
  }
});

export default CalendarScreen;