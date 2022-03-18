import React from "react";
import "react-native-gesture-handler";
import Navigator from "./Navigation";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./context/userContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </UserProvider>
  );
}
