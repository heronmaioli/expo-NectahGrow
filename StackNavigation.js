import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "./screens/Home/";
import QrCode from "./screens/QrCode/";
import AddManually from "./screens/AddManually/";
import UserRegister from "./screens/UserRegister/";
import HandleUser from "./screens/HandleUser";

const Stack = createNativeStackNavigator();

function StackNavigator() {
  const [storage, setStorage] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const storaged = await AsyncStorage.getItem("@boardID");
        setStorage(storaged);
      } catch (e) {
        alert("Deu erro");
      }
    })();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name={"HandleUser"} component={HandleUser}></Stack.Screen>

      {storage === null ? (
        <>
          <Stack.Screen name={"QrCode"} component={QrCode}></Stack.Screen>
          <Stack.Screen
            name={"AddManually"}
            component={AddManually}
          ></Stack.Screen>
          <Stack.Screen
            name={"UserRegister"}
            component={UserRegister}
          ></Stack.Screen>
        </>
      ) : ( */}
      <>
        <Stack.Screen name={"Home"} component={Home}></Stack.Screen>
      </>
      {/* )} */}
    </Stack.Navigator>
  );
}

export default StackNavigator;
