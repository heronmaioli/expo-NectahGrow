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
    const teste = async () => {
      try {
        const fUser = await AsyncStorage.getItem("@userId");
        setUser(fUser);
      } catch (e) {
        console.log("deu erro");
      }
    };
    teste();
  }, []);

  async function logOut() {
    await AsyncStorage.removeItem("@isLoged");
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
