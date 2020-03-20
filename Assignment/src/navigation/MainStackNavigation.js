import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './Screens/HomeScreen'
import AboutScreen from './Screens/Login'

import MainStackNavigator from './src/navigation/MainStackNavigator'
const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="mainStack" component={mainFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackNavigator;


export default function App() {
  return <MainStackNavigator />
}
