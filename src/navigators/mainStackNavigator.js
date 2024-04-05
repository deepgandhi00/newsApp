import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {routes} from './routes';
import NewsList from '../screens/newsList/newsList';
import Splash from '../screens/splash/splash';

const Stack = createStackNavigator();

// main navigator for the app
const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={routes.splash}>
        <Stack.Screen
          name={routes.newsList}
          component={NewsList}
          options={{
            title: 'Latest',
            headerTitleAlign: 'center',
            headerStyle: {elevation: 0},
          }}
        />
        <Stack.Screen
          name={routes.splash}
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;
