import times from 'lodash.times';
import t from 'timestamp-utils';

export const apiRoot = __DEV__ ? 'http://192.168.1.102:9002' : 'emt';

/* IOS COLORS */
export const iosColors = {
  darkBlue: '#147efb',
  lightBlue: '#5fc9f8',
  red: '#fc3d39',
  green: '#53d769',
  yellow: '#fecb2e',
  orange: '#fd9426',
  grey: '#8e8e93'
}

/* CALENDAR UTILS */
const DAYS_TO_DISPLAY_PER_MONTH = 42
const MONTHS_LENGHT = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export const isLeapYear = year => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

export const initMonth = timestamp => {
  timestamp = timestamp || new Date().getTime()
  const [year, month, dayNumber] = t.decompose(timestamp)
  const firstMonthDay = getDateWithoutTime(t.addDays(timestamp, -dayNumber + 1))
  const monthLenght = MONTHS_LENGHT[month - 1] || (isLeapYear(year) ? 29 : 28)
  const lastMonthDay = t.addDays(firstMonthDay, monthLenght - 1)
  const firstMonthDayNumber = t.getWeekDay(firstMonthDay)
  const firstDayToDisplay = t.addDays(firstMonthDay, -firstMonthDayNumber)

  return {
    firstMonthDay,
    lastMonthDay,
    firstDayToDisplay,
    month,
    year
  }
}

export const parseRange = (startDate, endDate) => ({
  startDate: endDate ? Math.min(startDate, endDate) : startDate,
  endDate: endDate && (endDate !== startDate) ? Math.max(startDate, endDate) : null
})

export const getDays = firstDay => times(DAYS_TO_DISPLAY_PER_MONTH, i => t.addDays(firstDay, i))

export const getDateWithoutTime = timestamp => {
  const [, , , hours, minutes, seconds, milliseconds] = t.decompose(timestamp)
  return t.add(timestamp, { hours: -hours, minutes: -minutes, seconds: -seconds, milliseconds: -milliseconds })
}

export const dateIsBetween = (date, start, end) => date > start && date < end

export const dateIsOut = (date, start, end) => date < start || date > end

export const formartTime = value => (`0${value}`).slice(-2)

export const formatDateString = value => {
  const dValue = new Date(value);
  let date = dValue.getDate();
  date = date < 10 ? `0${date}` : date;
  let month = dValue.getMonth();
  month = month < 10 ? `0${month}` : month;
  const year = dValue.getFullYear();
  return `${date}.${month}.${year}`;
}