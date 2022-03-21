import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';

import { UserProvider } from './context/userContext';
import Navigator from './Navigation';

export default function App() {
  return (
    <UserProvider>
      <StatusBar style="light" backgroundColor={"#2C302E"} />
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </UserProvider>
  );
}
