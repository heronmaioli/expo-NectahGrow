import React, { useCallback, useState, useEffect } from "react";

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "./styles.scss";

const UserRegister = ({ navigation }) => {
  const [boardID, setBoardID] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const value = await AsyncStorage.getItem("@boardID");
        console.log(value);
        if (value !== null) {
          setBoardID(value);
          console.log("n nulo:" + value);
        } else {
          console.log("nulo:" + value);
        }
      })();
      return () => {};
    }, [])
  );

  return (
    <ScrollView>
      <View style={Styles.background}>
        <StatusBar style="light" backgroundColor={"#2C302E"} />
        <View style={Styles.logoView}>
          <Image
            source={require("../../assets/Logo.png")}
            style={Styles.logoImage}
          />
        </View>

        <View style={Styles.formBox}>
          <View style={{ width: "100%" }}></View>
          <TouchableOpacity>
            <Text style={Styles.bottomLink}>Already have an account!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserRegister;
