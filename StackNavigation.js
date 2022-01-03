import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "./screens/Home/Home";
import QrCode from "./screens/QrCode/QrCode";
import AddManually from "./screens/AddManually/AddManually";
import UserRegister from "./screens/UserRegister/UserRegister";

const Stack = createNativeStackNavigator();

function StackNavigator() {
  const [storage, setStorage] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const storaged = await AsyncStorage.getItem("@boardID");
        setStorage(storaged);
      } catch (e) {
        console.log(e);
        alert("Deu erro");
      }
    })();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={"Home"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Group>
        <Stack.Screen name={"QrCode"} component={QrCode}></Stack.Screen>

        <Stack.Screen
          name={"AddManually"}
          component={AddManually}
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
