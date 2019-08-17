import axios from 'axios';
import { apiRoot } from '../util/index';

export const fetchAllKids = async store => {
  //console.log('FETCH ALL KIDS!!');
  const res = await axios.get(`${apiRoot}/child/all`);
  const kids = await res.data;
  store.setState({ allKids: kids });
}

export const fetchKidsForDate = async (store, date) => {
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1);
  const fdate = `${date.getFullYear()}-${month}-${day}`;
  const res = await axios.get(`${apiRoot}/child/all/${fdate}`);
  const kids = await res.data;
  //console.log('kids for date => ', kids);
  store.setState({ kidsForDate: kids });
}