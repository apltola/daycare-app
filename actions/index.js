import axios from 'axios';
import { apiRoot } from '../util/index';
import { formatDateString } from '../util';

export const fetchAllKids = async store => {
  try {
    const res = await axios.get(`${apiRoot}/child/all`);
    const kids = await res.data;
    store.setState({ allKids: kids });
  } catch (error) {
    console.error(error);
  }
}

export const fetchKidsForDate = async (store, date) => {
  try {
    const dateStr = formatDateString(date, 'yyyy-mm-dd');
    const res = await axios.get(`${apiRoot}/child/all/${dateStr}`);
    const kids = await res.data;
    store.setState({ kidsForDate: kids });
  } catch (error) {
    console.error(error);
  }
}