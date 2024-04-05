import axios from 'axios';
import {ITEMS_TO_BE_FETCH_FROM_API} from '../constants';

export const fetchNews = currentPage => {
  const url = `https://api.worldnewsapi.com/search-news?language=en&api-key=09ba7da495384fe89bcc57d998dd5b04&number=${ITEMS_TO_BE_FETCH_FROM_API}&offset=${
    currentPage * ITEMS_TO_BE_FETCH_FROM_API
  }`;
  return axios.get(url);
};
