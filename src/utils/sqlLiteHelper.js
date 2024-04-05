import {backgroundTaskOptions, fetchNewsAndStore} from './backgroundTask';
import {DB_NAME, ITEMS_PER_PAGE, REMAINING_ITEMS_THRESHOLD} from './constants';
import BackgroundService from 'react-native-background-actions';

var SQLite = require('react-native-sqlite-storage');

SQLite.enablePromise(true);

export default class SqlLiteHelper {
  constructor() {}

  // opening the db
  async open() {
    return new Promise((resolve, reject) => {
      SQLite.openDatabase({name: DB_NAME, location: 'default'})
        .then(db => {
          this.db = db;
          resolve(db);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // creating the table if not exists
  async createTableIfNotExists() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('db is not available');
      } else {
        this.db
          .executeSql(
            'CREATE TABLE IF NOT EXISTS news(id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, title TEXT NOT NULL, description TEXT, url TEXT, urlToImage TEXT)',
          )
          .then(res => {
            resolve('Created');
          })
          .catch(err => {
            reject('Error creating table' + err);
          });
      }
    });
  }

  // inserting list of news inside db
  async insertNews(newsList = []) {
    const insertQuery =
      'INSERT INTO news (author, title, description, url, urlToImage) VALUES (?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('db is not available');
      } else if (newsList?.length) {
        try {
          newsList.forEach(async news => {
            await this.db.executeSql(insertQuery, [
              news.author,
              news.title,
              news.text,
              news.url,
              news.image,
            ]);
          });
          resolve('Inserted the data');
        } catch (err) {
          reject('Error inserting data' + err);
        }
      } else {
        reject('Please provide valid news items');
      }
    });
  }

  // getting the paginated news from db
  async getNewsPaginated() {
    const selectQuery = `SELECT * FROM news ORDER BY id LIMIT ${ITEMS_PER_PAGE}`;
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('db is not available');
      } else {
        this.db
          .executeSql(selectQuery)
          .then(res => {
            let results = [];
            if (res[0]?.rows?.length) {
              for (var i = 0; i < res[0].rows.length; i++) {
                results.push(res[0].rows.item(i));
              }
            }
            this.deleteTheFetchedItems(results);
            resolve(results);
          })
          .catch(err => {
            reject('Error retrieveing data' + JSON.stringify(err));
          });
      }
    });
  }

  // deleting the news items which are read from the db
  async deleteTheFetchedItems(newsList = []) {
    const deleteQuery = 'DELETE FROM news WHERE id = ?';
    const countQuery = 'SELECT * FROM news';
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('db is not available');
      } else {
        try {
          newsList.forEach(async news => {
            await this.db.executeSql(deleteQuery, [news.id]);
          });
          this.db
            .executeSql(countQuery)
            .then(res => {
              resolve('Remaining data' + res[0]?.rows?.length);
              // checking if remaining items are less then threshold then calling the background service to fetch new items
              if (res[0]?.rows?.length < REMAINING_ITEMS_THRESHOLD) {
                BackgroundService.start(
                  fetchNewsAndStore,
                  backgroundTaskOptions,
                );
              }
            })
            .catch(err => {
              reject('Error getting count' + err);
            });
        } catch (err) {
          reject('Error inserting data' + err);
        }
      }
    });
  }

  // checking if data exists
  async checkIfDataExists() {
    const countQuery = 'SELECT * FROM news';
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('db is not available');
      } else {
        this.db
          .executeSql(countQuery)
          .then(res => {
            resolve(res[0]?.rows?.length);
          })
          .catch(err => {
            reject('Error getting count' + err);
          });
      }
    });
  }
}
