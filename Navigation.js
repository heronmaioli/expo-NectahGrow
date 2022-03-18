import React, { useEffect, useState, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useWindowDimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "./screens/Home";
import QrCode from "./screens/QrCode";
import AddManually from "./screens/AddManually";
import Login from "./screens/Login";
import Register from "./screens/Register";
import CustomDrawer from "./CustomDrawer";
import { UserContext } from "./context/userContext";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Navigator() {
  const { isLoged, setBoards, setIsLoged, boards } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const dimensions = useWindowDimensions();

  useEffect(() => {
    (async () => {
      try {
        const persist = await AsyncStorage.getItem("@persist");
        const boards = await AsyncStorage.getItem("@boards");
        if (persist) {
          setIsLoged(true);
        }
        setBoards(boards);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <>
      {isLoged && !isLoading && (
        <Drawer.Navigator
          screenOptions={{
            drawerPosition: "right",
            swipeEdgeWidth: dimensions.width,
            unmountOnBlur: true,
          }}
          drawerContent={(props) => (
            <CustomDrawer {...props} setIsLoged={setIsLoged} />
          )}
          backBehavior={"history"}
        >
          <Drawer.Screen name={"board" + boards?.lenght} component={Home} />
          <Drawer.Screen name="Home1" component={Home} />
          <Drawer.Screen name="Home2" component={Home} />
          <Drawer.Screen name="Home3" component={Home} />
          <Drawer.Screen name="Home4" component={Home} />
        </Drawer.Navigator>
      )}

      {!isLoged && !isLoading && (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name={"Login"}
            component={Login}
            setIsLoged={setIsLoged}
          ></Stack.Screen>
          <Stack.Screen
            name={"Register"}
            component={Register}
            setIsLoged={setIsLoged}
          ></Stack.Screen>
        </Stack.Navigator>
      )}
    </>
  );
  // {
  /* {storage === null ? (
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
      ) : (
        <> 
      <Stack.Screen name={"Home"} component={Home}></Stack.Screen>
      </>
      )}  */
  // }
}

export default Navigator;
