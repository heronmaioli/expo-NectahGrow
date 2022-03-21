import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Network from 'expo-network';
import React, { useContext, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { UserContext } from './context/userContext';
import CustomDrawer from './CustomDrawer';
import AddBoard from './screens/AddBoard';
import BoardScreen from './screens/Board';
import Home from './screens/Home';
import Login from './screens/Login';
import NoNetwork from './screens/NoNetwork';
import Register from './screens/Register';
import api from './services/api';
import Header from './shared/Header';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Navigator() {
  const { isLoged, setIsLoged, boards, setBoards } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const dimensions = useWindowDimensions();

  useEffect(() => {
    (async () => {
      try {
        const connected = await Network.getNetworkStateAsync();
        const userId = await AsyncStorage.getItem("@userId");
        const persist = await AsyncStorage.getItem("@persist");

        if (connected.isConnected) {
          setIsConnected(connected);
        }
        if (userId) {
          const response = await api.get("/verify?user=" + userId);
          setBoards(response.data.boards);
        }
        if (persist) {
          setIsLoged(true);
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err.response.data);
      }
    })();
  }, []);

  return (
    <>
      {isLoged && !isLoading && isConnected && (
        <Drawer.Navigator
          screenOptions={{
            drawerPosition: "right",
            swipeEdgeWidth: dimensions.width,
            unmountOnBlur: true,
            headerTitle: (props) => <Header props={props} />,
          }}
          drawerContent={(props) => (
            <CustomDrawer {...props} setIsLoged={setIsLoged} />
          )}
          backBehavior={"history"}
        >
          <Drawer.Screen name={"Home"} component={Home} />
          {boards.map((board) => {
            return (
              <Drawer.Screen
                key={boards.length}
                name={board.name}
                component={BoardScreen}
                initialParams={{ board: board.boardId }}
              />
            );
          })}
          <Drawer.Screen name={"Add Board"} component={AddBoard} />
        </Drawer.Navigator>
      )}

      {!isLoged && !isLoading && isConnected && (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name={"Login"}
            component={Login}
            setIsLoged={setIsLoged}
          />
          <Stack.Screen
            name={"Register"}
            component={Register}
            setIsLoged={setIsLoged}
          />
        </Stack.Navigator>
      )}

      {!isConnected && (
        <Stack.Navigator>
          <Stack.Screen component={NoNetwork} name={"NoNetwork"} />
        </Stack.Navigator>
      )}
    </>
  );
}

export default Navigator;
