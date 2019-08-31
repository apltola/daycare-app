import axios from 'axios';
import { apiRoot } from '../util/index';
import { formatDateString } from '../util';

export const fetchAllKids = async store => {
  try {
    const res = await axios.get(`${apiRoot}/child/all`);
    //const res = await axios.get('https://shrouded-garden-66270.herokuapp.com/child/all');
    const kids = await res.data;
    store.setState({ allKids: kids });
  } catch (error) {
    console.error(error);
  }
}

export const fetchKidsForDate = async (store, date) => {
  try {
    const dateStr = formatDateString(date, 'yyyy-mm-dd');

    /* const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1);
    const dateStr = `${date.getFullYear()}-${month}-${day}`; */

    const res = await axios.get(`${apiRoot}/child/all/${dateStr}`);
    const kids = await res.data;
    store.setState({ kidsForDate: kids });
  } catch (error) {
    console.error(error);
  }
}

export const getJson = async (store) => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/todos/');
  const data = await res.data;
  console.log('data => ', data);
}