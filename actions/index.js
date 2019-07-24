import axios from 'axios';
import { apiRoot } from '../util/index';

export const fetchAllKids = async store => {
  console.log('FETCH ALL KIDS!!');
  const res = await axios.get(`${apiRoot}/child/all`);
  const kids = await res.data;
  store.setState({ allKids: kids });
}