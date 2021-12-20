import React from "react";

import StackNavigator from "./StackNavigation";
import { NavigationContainer } from "@react-navigation/native";

// const socket = socketClient("https://gentle-savannah-77998.herokuapp.com/");

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
