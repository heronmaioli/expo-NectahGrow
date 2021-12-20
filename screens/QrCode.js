import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
import api from "../services/api";

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

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const fetchData = async () => {
      const response = await api.post("/checkboardId", { data: data });
      response.data
        ? navigation.navigate("UserRegister")
        : alert("Product ID is incorrect!");
    };
    fetchData();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#52AA5E" }}>
      <StatusBar style="light" backgroundColor={"#2C302E"} />
      {hasPermission && (
        <View style={{ flex: 1, backgroundColor: "#52AA5E" }}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <View
              style={{
                width: "70%",
                height: "40%",
                borderWidth: 4,
                borderRadius: 5,
                borderColor: !scanned ? "#fff" : "#C3423F",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "40%",
              }}
            >
              {!scanned && (
                <Text
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 18,
                    fontWeight: "900",
                  }}
                >
                  QR HERE
                </Text>
              )}

              {scanned && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => setScanned(false)}
                >
                  <Text
                    style={{
                      color: "#C3423F",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    TAP TO SCAN AGAIN
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </BarCodeScanner>
          <View
            style={{
              bottom: 0,
              backgroundColor: "#52AA5E",
              position: "absolute",
              width: "100%",
              height: "20%",
              alignItems: "center",
              justifyContent: "center",
              borderTopWidth: 1,
              borderColor: "#474A48",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("AddManually")}
            >
              <Text
                style={{
                  fontSize: 22,
                  color: "#2C302E",
                  fontWeight: "bold",
                  margin: 25,
                }}
              >
                Or add manually
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert("go to login")}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#227C9D",
                  borderBottomWidth: 1,
                  borderColor: "#227C9D",
                }}
              >
                Already have an account!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
