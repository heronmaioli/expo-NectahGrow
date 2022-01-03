import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import api from "../../services/api";
import Styles from "./AddManually.scss";

const AddManually = ({ navigation }) => {
  const [inputValue, setInputValue] = useState("");

  const sendIt = async () => {
    const response = await api.post("/checkboardId", { data: inputValue });
    response.data
      ? navigation.navigate("UserRegister")
      : alert("Product ID is incorrect!");
  };

  return (
    <View style={Styles.background}>
      <View style={Styles.mainLayer}>
        <View style={Styles.logoView}>
          <Image
            source={require("../../assets/Logo.png")}
            style={{ width: 380, height: 160 }}
          />
        </View>
        <View style={Styles.formView}>
          <View style={Styles.formBox}>
            <Text style={Styles.textLabel}>Insert product ID</Text>
            <TextInput
              onChangeText={setInputValue}
              value={inputValue}
              style={Styles.textInput}
              inlineImageRight="search_icon"
              placeholder={"ex: 246f28b45774"}
              backgroundColor={"#fff"}
              placeholderTextColor={"#777"}
            />
            <TouchableOpacity style={Styles.sendButton}>
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
      <View style={Styles.bottomTab}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Text style={Styles.bottomText}>Or scan QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("go to login")}>
          <Text style={Styles.bottomLink}>Already have an account!</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" backgroundColor={"#2C302E"} />
    </View>
  );
};

export default AddManually;
