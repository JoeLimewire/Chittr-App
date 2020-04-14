
//============================================================== IMPORTS ==============================================================
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//============================================================== PAGES ==============================================================
import HomeScreen from './Screens/HomeScreen'
import SignUp from './Screens/signUp'
import mainFeed from './Screens/mainFeed'
import updateFeed from './Screens/updateFeed'
import myProfile from './Screens/myProfile'
import profileUpdateDetails from './Screens/profileUpdateDetails'
import cameraTest from './Screens/cameraTest'
import external from './Screens/externalProfile'

//Create Stack
const Stack = createStackNavigator();

//============================================================== STACKS ==============================================================
function MainStackNavigator() {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="mainFeed" component={mainFeed} />
        <Stack.Screen name="updateFeed" component={updateFeed} />
        <Stack.Screen name="myProfile" component={myProfile} />
        <Stack.Screen name="profileUpdateDetails" component={profileUpdateDetails} />
        <Stack.Screen name="cameraTest" component={cameraTest} />
        <Stack.Screen name="external" component={external} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}


//Stack Exports
export default function App() {
  return <MainStackNavigator />
}
  /*
  Joseph Higgins
  Chittr
  Version-0.0.3
  */