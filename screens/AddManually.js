import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import api from "../services/api";

const AddManually = ({ navigation }) => {
  const [inputValue, setInputValue] = useState("");
  const [responseValue, setResponseValue] = useState();

  const sendIt = async () => {
    const response = await api.post("/checkboardId", { data: inputValue });
    response.data
      ? navigation.navigate("UserRegister")
      : alert("Product ID is incorrect!");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#52AA5E",
      }}
    >
      <View
        style={{
          flex: 1,
          maxHeight: "50%",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "70%",
            paddingBottom: "2%",
            paddingTop: "10%",
          }}
        >
          <Image
            source={require("../assets/Logo.png")}
            style={{ width: 380, height: 160 }}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            width: "100%",
            height: "60%",
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              width: "75%",
              height: "auto",
              borderRadius: 5,
              backgroundColor: "#2C302E",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                color: "#fff",
                fontWeight: "bold",
                margin: 25,
              }}
            >
              Insert product ID
            </Text>
            <TextInput
              onChangeText={setInputValue}
              value={inputValue}
              style={{
                width: "60%",
                borderRadius: 5,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10,
              }}
              inlineImageRight="search_icon"
              placeholder={"ex: 246f28b45774"}
              backgroundColor={"#fff"}
              placeholderTextColor={"#777"}
            />
            <TouchableOpacity
              style={{
                margin: 25,
                backgroundColor: "#fff",
                borderColor: "#227C9D",
                borderWidth: 2,
                borderRadius: 5,
                padding: 10,
                width: "40%",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#227C9D", fontWeight: "700" }}
                onPress={() => sendIt()}
              >
                SEND IT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          maxHeight: "20%",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Text
            style={{
              fontSize: 22,
              color: "#2C302E",
              fontWeight: "bold",
              margin: 25,
            }}
          >
            Or scan QR Code
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
      <StatusBar style="light" backgroundColor={"#2C302E"} />
    </View>
  );
};

export default AddManually;
