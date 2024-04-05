import {fetchNews} from './networking/news';
import {getCurrentPage, setCurrentPage} from './preferncesHelper';
import SqlLiteHelper from './sqlLiteHelper';
import BackgroundService from 'react-native-background-actions';

// background task to fetch the 100 news and storing it in db
export const fetchNewsAndStore = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentPage = await getCurrentPage();
      const parsedCurrentPage = Number(currentPage || 0);
      fetchNews(parsedCurrentPage)
        .then(async res => {
          const sqlLiteHelper = new SqlLiteHelper();
          await sqlLiteHelper.open();
          await sqlLiteHelper.createTableIfNotExists();
          await sqlLiteHelper.insertNews(res?.data?.news);
          await setCurrentPage(`${parsedCurrentPage + 1}`);
          BackgroundService.stop();
        })
        .catch(err => {
          BackgroundService.stop();
        });
    } catch (err) {
      BackgroundService.stop();
    }
  });
};

// for displaying notifications in android for background task
export const backgroundTaskOptions = {
  taskName: 'Fetch',
  taskTitle: 'Fetching Latest news...',
  taskDesc: 'Fetching Latest news...',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
};
