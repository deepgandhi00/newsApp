/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {createContext} from 'react';
import MainStackNavigator from './src/navigators/mainStackNavigator';
import SqlLiteHelper from './src/utils/sqlLiteHelper';

// creating context for db to provide instance for accessing methods related to db
export const DBContext = createContext(null);

const App = () => {
  const sqlLiteHelper = new SqlLiteHelper();
  return (
    <DBContext.Provider value={sqlLiteHelper}>
      <MainStackNavigator />
    </DBContext.Provider>
  );
};

export default App;
