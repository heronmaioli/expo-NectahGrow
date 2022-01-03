import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import Styles from "./QrCode.scss";

export default function QrCode({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        status === "denied"
          ? navigation.navigate("AddManually")
          : setHasPermission(status === "granted");
      })();
      return () => {};
    }, [])
  );

  const onReadSuccess = async (data) => {
    try {
      await AsyncStorage.setItem("@boardID", data);
      navigation.navigate("UserRegister");
    } catch (e) {
      console.log(e);
      alert("Deu erro");
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const fetchData = async () => {
      const response = await api.post("/checkboardId", { data: data });
      response.data ? onReadSuccess(data) : alert("Product ID is incorrect!");
    };
    fetchData();
  };

  return (
    <SafeAreaView style={Styles.container}>
      <StatusBar style="light" backgroundColor={"#2C302E"} />
      {hasPermission && (
        <View style={Styles.container}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={Styles.barcode}
          >
            <View
              style={
                !scanned ? Styles.insideSquareWhite : Styles.insideSquareRed
              }
            >
              {!scanned && <Text style={Styles.whiteText}>QR HERE</Text>}

              {scanned && (
                <TouchableOpacity
                  style={Styles.touchArea}
                  onPress={() => setScanned(false)}
                >
                  <Text style={Styles.redText}>TAP TO SCAN AGAIN</Text>
                </TouchableOpacity>
              )}
            </View>
          </BarCodeScanner>
          <View style={Styles.bottomTab}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddManually")}
            >
              <Text style={Styles.bottomText}>Or add manually</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert("go to login")}>
              <Text style={Styles.bottomLink}>Already have an account!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
