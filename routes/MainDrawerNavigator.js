import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useContext, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { API_ADDRESS_LOCAL, API_ADDRESS_PRODUCTION } from 'react-native-dotenv';
import io from 'socket.io-client';

import { UserContext } from '../context/userContext';
import CustomDrawer from '../CustomDrawer';
import BoardScreen from '../screens/Board';
import Home from '../screens/Home';
import api from '../services/api';
import Header from '../shared/Header';
import AddNewGrow from './AddNewGrow';

// const socket = io(API_ADDRESS_PRODUCTION);
const socket = io(API_ADDRESS_LOCAL);

export default function MainDrawerNavigator() {
  const Drawer = createDrawerNavigator();
  const dimensions = useWindowDimensions();
  const { boards, setBoards, setIsLoged } = useContext(UserContext);

  async function logOut() {
    try {
      await AsyncStorage.removeItem("@persist");
      await AsyncStorage.removeItem("@boards");
      await AsyncStorage.removeItem("@userId");
      setBoards([]);
      setIsLoged(false);
      socket.disconnect();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    (async () => {
      const userId = await AsyncStorage.getItem("@userId");
      const persist = await AsyncStorage.getItem("@persist");
      if (userId) {
        const response = await api.get("/verify?user=" + userId);
        setBoards(response.data.boards);
      }
      if (persist) {
        setIsLoged(true);
      }
    })();
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
        swipeEdgeWidth: dimensions.width,
        unmountOnBlur: true,
        header: (props) => <Header props={props} />,
      }}
      drawerContent={(props) => <CustomDrawer {...props} logOut={logOut} />}
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
      <Drawer.Screen name={"New Grow"} component={AddNewGrow} />
    </Drawer.Navigator>
  );
}
