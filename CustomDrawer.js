import React, { useEffect, useContext } from "react";
import { View } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./context/userContext";

export default function CustomDrawer(props) {
  const { setUser, setIsLoged } = useContext(UserContext);
  useEffect(() => {
    (async () => {
      try {
        const fUser = await AsyncStorage.getItem("@userId");
        if (!fUser) {
          setIsLoged(false);
          await AsyncStorage.removeItem("@persist");
          await AsyncStorage.removeItem("@boards");
          throw "User ID it's not storaged";
        }
        setUser(fUser);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  async function logOut() {
    await AsyncStorage.removeItem("@persist");
    await AsyncStorage.removeItem("@boards");
    await AsyncStorage.removeItem("@userId");
    setIsLoged(false);
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
