import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import Popup from '../components/Popup';
import t from 'timestamp-utils';
import DateTimePicker from "react-native-modal-datetime-picker";
import axios from 'axios';
import Spinner from '../components/Spinner';
import { initMonth, getDays, dateIsOut, getDateWithoutTime, formatDateString, iosColors, apiRoot, customColors } from '../util';
import union from 'lodash/union';

const TODAY = new Date();
const SCREEN_WIDTH = Dimensions.get('window').width;
const CALENDAR_DATE_WIDTH = SCREEN_WIDTH / 5;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const DAY_LABELS = ['SU', 'MA', 'TI', 'KE', 'TO', 'PE', 'LA'];
const DAY_LABELS_LOWERCASE = ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'];
const DAY_NAMES = ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'];
const MONTH_LABELS = ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];

function CalendarScreen(props) {
  this._scrollViewRef = React.createRef();
  const [kidSchedules, setKidSchedules] = useState([]);
  const [dateData, setDateData] = useState({...initMonth()});
  const [selectedDays, setSelectedDays] = useState([]);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState('');
  const [postData, setPostData] = useState([]);
  const [daysWithArrival, setDaysWithArrival] = useState([]);
  const [daysWithDeparture, setDaysWithDeparture] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [deleteScheduleLoading, setDeleteScheduleLoading] = useState({ active: false, scheduleId: null });

  /* Navigation props */
  const kid = props.navigation.getParam('kid', {});

  const fetchSchedules = async () => {
    const res = await axios.get(`${apiRoot}/schedule/child/${kid.id}`);
    const schedules = await res.data;
    setKidSchedules(() => schedules);
  }

  const scrollCalendarToToday = () => {
    if (!this._scrollViewRef.getNode) {
      return;
    }

    const dayNo = TODAY.getDate();
    const distance = dayNo * CALENDAR_DATE_WIDTH - CALENDAR_DATE_WIDTH;
    this._scrollViewRef.getNode().scrollTo({ x: distance, y: 0, animated: true });
  }

  useEffect(() => {
    fetchSchedules();
    scrollCalendarToToday();

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

  const handleTimeButtonPress = type => {
    setTimePickerTarget(type);
    setIsTimePickerVisible(true);
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
        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: 16}}>
            Tee jotaki...
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            style={{marginRight: 15, padding: 5}}
            onPress={() => {
              this._scrollViewRef.getNode && this._scrollViewRef.getNode().scrollTo({ x: 0, y: 0, animated: true });
              return changeMonth(-1);
            }}
          >
            <Icon
              name="chevron-left"
              type="font-awesome"
              color={iosColors.grey}
              size={20}
            />
          </TouchableOpacity>
          <Text style={{fontSize: 16}}>
            {`${monthLabel} ${dateData.year}`}
          </Text>
          <TouchableOpacity
            style={{marginLeft: 15, padding: 5}}
            onPress={() => {
              this._scrollViewRef.getNode && this._scrollViewRef.getNode().scrollTo({ x: 0, y: 0, animated: true });
              return changeMonth(1);
            }}
          >
            <Icon
              name="chevron-right"
              type="font-awesome"
              color={iosColors.grey}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderCheckmark = day => {
    const idx = kidSchedules.findIndex(i => i.date === formatDateString(day, 'yyyy-mm-dd'));
    if (idx > -1) {
      return (
        <Icon
          name="circle"
          type="font-awesome"
          color={iosColors.green}
          size={10}
          iconStyle={{paddingTop: 3}}
        />
      )
    }
  }

  const renderCalendar = () => {
    return (
      <Animated.ScrollView
        ref={e => this._scrollViewRef = e}
        horizontal={true}
        showScrollBar={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
        }}
      >
        <View style={styles.calendar}>
          {
            getDays(dateData.firstDayToDisplay).map(day => {
              const dayOfWeek = new Date(day).getDay();
              const dayLabel = DAY_LABELS[dayOfWeek];

              return (
                <TouchableOpacity
                  key={day}
                  style={[getCalendarClassNames(day, 'view'), {
                    opacity: dayOfWeek === 0 || dayOfWeek === 6 ? 0.4 : 1
                  }]}
                  onPress={() => onDaySelect(day)}
                  disabled={dateIsOut(day, dateData.firstMonthDay, dateData.lastMonthDay)}
                >
                  <Text style={[getCalendarClassNames(day, 'text'), {
                    textAlign:'center',
                    fontWeight:500,
                    fontSize: 14,
                  }]}
                  >
                    {dayLabel}
                  </Text>
                  <Text style={getCalendarClassNames(day, 'text')}>
                    {parseInt(t.getDay(day), 10)}
                  </Text>
                  {renderCheckmark(day)}
                </TouchableOpacity>
              )
            })
          }
        </View>
      </Animated.ScrollView>
    );
  }

  const renderButtons = () => {
    const submitButtonShouldBeDisabled = () => {
      return postData.length === 0 || postData.findIndex(i => !i.arrive || !i.departure) > -1;
    }
    
    const renderSubmitButton = () => {
      const disabled = submitButtonShouldBeDisabled();

      if (loading) {
        return (
          <View style={styles.submitButtonContainer}>
            <Spinner size="large" />
          </View>
        );
      } else {
        return (
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButton, { opacity: disabled ? 0.35 : 1 }]}
              disabled={disabled}
            >
              <Text style={styles.submitButton_text}>
                Tallenna
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    }

    if (selectedDays.length > 0) {
      return (
        <View>
          <View style={styles.timeButtonsContainer}>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => handleTimeButtonPress('arrival')}
            >
              <Text style={styles.timeButton_text}>
                Aseta saapumisaika
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => handleTimeButtonPress('departure')}
            >
              <Text style={styles.timeButton_text}>
                Aseta lähtöaika
              </Text>
            </TouchableOpacity>
          </View>
          {renderSubmitButton()}
        </View>
      );
    }
  }

  const renderTimeTable = () => {
    const existingSchedules = kidSchedules.map(i => new Date(i.date).getTime());
    const newSchedules = getDaysWithSchedule();
    const daysWithSchedule = union(existingSchedules, newSchedules);
    
    const today = new Date(formatDateString(new Date(), 'yyyy-mm-dd')).getTime();
    const futureDaysWithSchedule = daysWithSchedule.filter(i => i >= today);
    const selectedMonthDaysWithSchedule = daysWithSchedule.filter(i => i >= dateData.firstMonthDay && i <= dateData.lastMonthDay);

    futureDaysWithSchedule.sort();
    selectedMonthDaysWithSchedule.sort();

    const renderList = days => {
      if (days.length === 0) {
        return (
          <View style={[styles.timeTableRow, { borderColor: customColors.lightGrey, paddingVertical: 10 }]}>
            <Text>
              Ei tallennettuja tietoja
            </Text>
          </View>
        );
      }

      else return days.map(day => {
        const dayOfWeek = new Date(day).getDay();
        const dayLabel = DAY_LABELS_LOWERCASE[dayOfWeek];
        const dateStr = formatDateString(day, 'dd.mm');
        let scheduleData;
        let arrivalStr;
        let departureStr;
        if (postData.findIndex(i => i.temp_id === day) === -1) {
          scheduleData = kidSchedules.find(item => new Date(item.date).getTime() === day);
          arrivalStr = scheduleData.arrive ? scheduleData.arrive.substring(0,5) : '';
          departureStr = scheduleData.departure ? scheduleData.departure.substring(0,5) : '';
        } else {
          scheduleData = postData.find(item => item.temp_id === day);
          arrivalStr = scheduleData.arrive ? formatDateString(scheduleData.arrive, 'hh:mm') : '';
          departureStr = scheduleData.departure ? formatDateString(scheduleData.departure, 'hh:mm') : '';
        }

        const dayHasExistingSchedule = existingSchedules.findIndex(i => i === day) > -1;
        const borderColor = dayHasExistingSchedule ? customColors.lightGrey : iosColors.darkBlue;

        const renderDeleteButton = () => {
          const deleteButton = () => (
            <TouchableOpacity
            onPress={() => handleScheduleDeleted(scheduleData)}
            style={styles.deleteScheduleButton}
            disabled={!dayHasExistingSchedule}
            >
              <Icon
                name="trash"
                type="font-awesome"
                size={25}
                color={dayHasExistingSchedule ? iosColors.red : 'white'}
                iconStyle={{backgroundColor:'white'}}
              />
            </TouchableOpacity>
          );

          if (!deleteScheduleLoading.active) {
            return deleteButton();
          } else {
            if (deleteScheduleLoading.scheduleId === scheduleData.id) {
              return (
                <Spinner size="small" />
              );
            } else {
              return deleteButton();
            }
          }
        }

        return (
          <View style={[styles.timeTableRow, { borderColor: borderColor }]}>
            <View style={styles.timeTableRowTextContainer}>
              <Text style={[styles.timeTableRowText, {width: 120}]}>
                {dayLabel} {dateStr}
              </Text>
            </View>
            <View style={styles.timeTableRowTextContainer}>
              <Text style={styles.timeTableRowText}>
                {arrivalStr}
              </Text>
            </View>
            <View style={styles.timeTableRowTextContainer}>
              <Text style={styles.timeTableRowText}> – </Text>
            </View>
            <View style={styles.timeTableRowTextContainer}>
              <Text style={styles.timeTableRowText}>
                {departureStr}
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
              {renderDeleteButton()}
            </View>
          </View>
        );
      })
    }

    return (
      <View style={styles.timeTable}>
        <Animated.ScrollView
          horizontal={true}
          pagingEnabled={true}
        >
          <View style={styles.timeTablePage}>
            <View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: 10}}>
              <Icon name="circle" type="font-awesome" size={12} color={iosColors.black} iconStyle={{marginHorizontal: 3}} />
              <Icon name="circle" type="font-awesome" size={12} color={customColors.grey} iconStyle={{marginHorizontal: 3}} />
            </View>
            <Text style={styles.timeTableTitle}>
              Aikataulu tästä päivästä eteenpäin
            </Text>
            <View style={{flex:1, maxHeight: 400}}>
              <Animated.ScrollView
                contentContainerStyle={{paddingVertical: 10}}
              >
                {renderList(futureDaysWithSchedule)}
              </Animated.ScrollView>
            </View>
          </View>

          <View style={styles.timeTablePage}>
            <View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: 10}}>
              <Icon name="circle" type="font-awesome" size={12} color={customColors.grey} iconStyle={{marginHorizontal: 3}} />
              <Icon name="circle" type="font-awesome" size={12} color={iosColors.black} iconStyle={{marginHorizontal: 3}} />
            </View>
            <Text style={styles.timeTableTitle}>
              Valitun kuukauden aikataulu
            </Text>
            <View style={{flex:1, maxHeight: 400}}>
              <Animated.ScrollView
                contentContainerStyle={{paddingVertical: 10}}
              >
                {renderList(selectedMonthDaysWithSchedule)}
              </Animated.ScrollView>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    );
  }

  const handleScheduleDeleted = async schedule => {
    setDeleteScheduleLoading({ active: true, scheduleId: schedule.id });

    try {
      const res = await axios.delete(`${apiRoot}/schedule/delete/${schedule.id}`);
      await fetchSchedules();
      setSubmitResult(res);
      setDeleteScheduleLoading({ active: false, scheduleId: null });
    } catch (e) {
      setSubmitResult(res);
      await fetchSchedules();
      setDeleteScheduleLoading({ active: false, scheduleId: null });
    }
  }

  const handleSubmit = async () => {
    setLoading(() => true);

    try {
      const res = await axios.post(`${apiRoot}/schedule/add/many`, postData);
      await fetchSchedules();
      setSubmitResult(res);
      setLoading(false);
      setShowPopup(true);
      setSelectedDays([]);
    } catch (e) {
      setSubmitResult(res);
      setLoading(false);
      setShowPopup(true);
    }
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: 20,
        }}
      >
        <View style={styles.kidTitle}>
          <Text style={styles.kidTitle_text}>
            {`${kid.firstName}, ${kid.childgroup.name}`}
          </Text>
        </View>
        
        <View style={styles.greyContainer}>
          <View style={styles.calendarContainer}>
            {renderCalendarNavigation()}
            {renderCalendar()}
          </View>
          
          {renderButtons()}
          {renderTimeTable()}

          <View style={{marginTop: 60}}>
            <Text>
              selectedDays: {JSON.stringify(selectedDays, null, 2)}
            </Text>
            <Text>
              postData: {JSON.stringify(postData, null, 2)}
            </Text>
            {/* <Text>
              daysWithArrival: {JSON.stringify(daysWithArrival, null, 2)}
            </Text>
            <Text>
              daysWithDeparture: {JSON.stringify(daysWithDeparture, null, 2)}
            </Text>
            <Text>
              timePickerTarget: {JSON.stringify(timePickerTarget, null, 2)}
            </Text> */}
            <Text>
              res: {JSON.stringify(submitResult.status, null, 2)}
            </Text>
          </View>
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

        <Popup
          dialogType='submitNotification'
          actionType='modify'
          visible={showPopup}
          handleTouchOutside={() => setShowPopup(() => false)}
          handlePopupClose={() => setShowPopup(() => false)}
          submitWasSuccessful={submitResult.status === 200}
        />

      </Animated.ScrollView>
    </View>
  );
}

CalendarScreen.navigationOptions = () => ({

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //borderWidth: 1,
    //borderColor: 'goldenrod'
  },
  greyContainer: {
    backgroundColor: '#F5FBFE',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: SCREEN_HEIGHT,
  },
  kidTitle_text: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingHorizontal: 10,
    paddingBottom: 20,
    color: iosColors.black,
  },
  calendarNavigation: {
    flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  calendarContainer: {
    paddingTop: 20,
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
    flexWrap: 'nowrap',
    paddingTop: 10,
  },
  day: {
    width: CALENDAR_DATE_WIDTH,
    height: 70,
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 5,
    borderColor: customColors.lightGrey,
    paddingTop: 5,
    backgroundColor: 'white',
  },
  day_text: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 500,
    paddingTop: 1,
  },
  dayOutOfMonth_text: {
    opacity: 0.3,
  },
  dayToday_text: {
    color: iosColors.red,
    fontWeight: 'bold',
  },
  daySelected: {
    backgroundColor: '#7CD2F9'
  },
  daySelected_text: {
    color: 'white',
    fontWeight: 'bold'
  },
  selectedDaysTitle: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  timeButtonsContainer: {
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  submitButtonContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButton: {
    borderWidth: 0.5,
    borderColor: customColors.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  submitButton: {
    borderWidth: 0.5,
    borderColor: iosColors.green,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: iosColors.green,
  },
  timeButton_text: {
    color: iosColors.black,
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton_text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  timeTable: {
    marginTop: 30,
    //borderWidth: 0.5,
  },
  timeTablePage: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 10,
  },
  timeTableTitle: {
    color: iosColors.black,
    fontSize: 16,
    fontWeight: 600,
  },
  timeTableRow: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderWidth: 0.5,
  },
  timeTableRowTextContainer: {
    justifyContent: 'center',
  },
  timeTableRowText: {
    fontSize: 16,
    color: iosColors.black,
    display: 'flex',
    justifyContent: 'center',
  },
  deleteScheduleButton: {
    padding: 10
  },
});

export default CalendarScreen;