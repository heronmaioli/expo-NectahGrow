import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';

import { UserContext } from './context/userContext';

export default function CustomDrawer(props) {
  const { setUser, setIsLoged, setBoards } = useContext(UserContext);
  useEffect(() => {
    (async () => {
      try {
        const fUser = await AsyncStorage.getItem("@userId");
        if (!fUser) {
          setIsLoged(false);
          await AsyncStorage.removeItem("@persist");
          await AsyncStorage.setItem("@boards", []);
          throw "User ID it's not storaged";
        }
        setUser(fUser);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  async function logOut() {
    try {
      await AsyncStorage.removeItem("@persist");
      await AsyncStorage.removeItem("@boards");
      await AsyncStorage.removeItem("@userId");
      setBoards([]);
      setIsLoged(false);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="LogOut" onPress={() => logOut()} />
      </DrawerContentScrollView>
    </View>
  );
}
