import axios from 'axios';
import { apiRoot } from '../util/index';

export const fetchAllKids = async store => {
  console.log('FETCH ALL KIDS!!');
  const res = await axios.get(`${apiRoot}/child/all`);
  const kids = await res.data;
  store.setState({ allKids: kids });
}

export const fetchKidsForDate = async (store, date) => {
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
  const fdate = `${date.getFullYear()}-${month}-${day}`
  console.log(fdate);
}