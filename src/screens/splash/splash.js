import React, {useContext, useEffect, useState} from 'react';
import SplashView from './splashView';
import {Alert, BackHandler} from 'react-native';
import {DBContext} from '../../../App';
import {useNavigation} from '@react-navigation/native';
import {routes} from '../../navigators/routes';
import BackgroundService from 'react-native-background-actions';
import {
  backgroundTaskOptions,
  fetchNewsAndStore,
} from '../../utils/backgroundTask';

const Splash = () => {
  const sqlLiteHelper = useContext(DBContext);
  const navigation = useNavigation();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeDb();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      navigation.replace(routes.newsList);
    }
  }, [isInitialized, navigation]);

  // opening the sql lite db and creating table if its a first run otherwise it will move forward
  const initializeDb = async () => {
    try {
      await sqlLiteHelper.open();
      await sqlLiteHelper.createTableIfNotExists();

      // checking if data exists inside the table else starting the background job to fetch 100 news and store it in db
      sqlLiteHelper
        .checkIfDataExists()
        .then(res => {
          if (res === 0) {
            BackgroundService.start(fetchNewsAndStore, backgroundTaskOptions);
          }
          setTimeout(() => setIsInitialized(true), 3000);
        })
        .catch(err => {
          console.log('err', err);
        });
    } catch (err) {
      Alert.alert('Error', 'Error in retriving data. Please try in sometime', [
        {text: 'OK', onPress: () => BackHandler.exitApp()},
      ]);
    }
  };

  return <SplashView />;
};

export default Splash;
