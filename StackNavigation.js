import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import QrCode from "./screens/QrCode";
import AddManually from "./screens/AddManually";
import UserRegister from "./screens/UserRegister";

const Stack = createNativeStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name={"QrCode"} component={QrCode}></Stack.Screen>
        <Stack.Screen
          name={"AddManually"}
          component={AddManually}
          options={{ presentation: "transparentModal" }}
        ></Stack.Screen>
        <Stack.Screen
          name={"UserRegister"}
          component={UserRegister}
        ></Stack.Screen>
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name={"Home"} component={Home}></Stack.Screen>
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default StackNavigator;
