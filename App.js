import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import io from 'socket.io-client';

import { UserProvider } from './context/userContext';
import Navigator from './Navigation';

// const socket = io("http://192.168.0.12:80");
// socket.on("connect", () => {
//   console.log(socket.id);
// });
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
