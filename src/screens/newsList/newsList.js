import React, {useContext, useEffect, useRef, useState} from 'react';
import NewsListView from './newsListView';
import {
  DATA_CHECK_INTERVAL,
  FETCH_MORE_INTERVAL,
  ITEMS_PER_PAGE,
} from '../../utils/constants';
import {DBContext} from '../../../App';
import {Alert, BackHandler} from 'react-native';

const NewsList = () => {
  // interval reference for storing the reference to the interval started
  const intervalRef = useRef();
  // reference to store the data checking interval to check if data is fetched and stored in db from api
  const dataCheckInterval = useRef();
  // context reference for accessing db methods
  const sqlLiteHelper = useContext(DBContext);
  // news items reference for accessing the news items displayed
  const newsItemRefs = useRef(new Map());

  const [pinnedNews, setPinnedNews] = useState(null);
  const [filteredNews, setFilteredNews] = useState(null);
  const [fetchedNews, setFetchedNews] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDataExists, setIsDataExists] = useState(false);
  const [toggleTimer, setToggleTimer] = useState(null);

  useEffect(() => {
    // checking if data is there in db if there the fetching the initial items to display and starting the interval to fetch new items every 10 secs
    // if data not there then starting interval to check if data is fetched and stored in api through background task
    sqlLiteHelper
      .checkIfDataExists()
      .then(res => {
        if (res > 0) {
          setIsDataExists(true);
        } else {
          setIsDataExists(false);
          checkIfDataFetched();
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, []);

  useEffect(() => {
    // getting the initial results for news
    if (isDataExists) {
      sqlLiteHelper
        .getNewsPaginated()
        .then(res => {
          setFetchedNews(res);
          setToggleTimer(true);
        })
        .catch(err => {
          console.log('err', err);
        });
    }
  }, [isDataExists]);

  useEffect(() => {
    // toggling the timer when new items are fetched manually by triggering the refresh or automatically after 10 sec timer
    if (toggleTimer !== null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchMoreItems, FETCH_MORE_INTERVAL);
      } else {
        intervalRef.current = setInterval(fetchMoreItems, FETCH_MORE_INTERVAL);
      }
    }
    // interval cleanup on component unmount
    return () => clearInterval(intervalRef?.current);
  }, [toggleTimer]);

  useEffect(() => {
    // filtering the pinned news after every new items fetched or removed from the pin
    if (pinnedNews) {
      let filter = fetchedNews.filter(item => item.url !== pinnedNews.url);
      setFilteredNews(filter);
    } else {
      setFilteredNews(fetchedNews);
    }
  }, [pinnedNews, fetchedNews]);

  const checkIfDataFetched = () => {
    // checking if the data is there in db
    dataCheckInterval.current = setInterval(() => {
      sqlLiteHelper
        .checkIfDataExists()
        .then(res => {
          if (res > 0) {
            setIsDataExists(true);
          }
          clearInterval(dataCheckInterval.current);
        })
        .catch(err => {
          console.log('err', err);
          Alert.alert(
            'Error',
            'Error in retriving data. Please try in sometime',
            [{text: 'OK', onPress: () => BackHandler.exitApp()}],
          );
        });
    }, DATA_CHECK_INTERVAL);
  };

  const fetchMoreItems = (isManuallyTriggered = false) => {
    // fetching more news items on manually triggering or automatically after 10 sec
    setIsRefreshing(isManuallyTriggered);
    sqlLiteHelper
      .getNewsPaginated()
      .then(res => {
        if (res?.length) {
          let allItems = [...res, ...fetchedNews];
          setFetchedNews(allItems);
          setToggleTimer(prev => !prev);
          setIsRefreshing(false);
        } else {
          setIsRefreshing(false);
        }
      })
      .catch(err => {
        console.log('err', err);
        setIsRefreshing(false);
      });
  };

  // swipe action methods to pin, remove pin or delete the news items
  const onPinClick = newPinnedNews => {
    setPinnedNews(newPinnedNews);
  };

  const removePinnedNews = () => {
    setPinnedNews(null);
  };

  const deleteNews = news => {
    let currentNews = [...fetchedNews];
    let remainingNews = currentNews.filter(item => item.id !== news.id);
    setFetchedNews(remainingNews);
  };

  return (
    <NewsListView
      news={filteredNews}
      pinnedNews={pinnedNews}
      onPinClick={onPinClick}
      removePinnedNews={removePinnedNews}
      isRefreshing={isRefreshing}
      fetchMoreItems={fetchMoreItems}
      deleteNews={deleteNews}
      newsItemRefs={newsItemRefs}
    />
  );
};

export default NewsList;
