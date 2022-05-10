import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';

import { UserContext } from './context/userContext';

export default function CustomDrawer(props) {
  const { setUser, setIsLoged } = useContext(UserContext);
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

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="LogOut" onPress={() => props.logOut()} />
      </DrawerContentScrollView>
    </View>
  );
}
