import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Checkbox from "expo-checkbox";

import Styles from "../styles.scss";

export default function LoginForm() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);

  const register = async () => {
    const response = await api.post("/checkboardId", { data: inputValue });
    response.data
      ? navigation.navigate("UserRegister")
      : alert("Product ID is incorrect!");
  };
  return (
    <View style={Styles.formContent}>
      <Text style={Styles.textLabel}>Login</Text>
      <TextInput
        onChangeText={setNickname}
        value={nickname}
        style={Styles.textInput}
        placeholder={"Nickname"}
        placeholderTextColor={"#777"}
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        style={Styles.textInput}
        placeholder={"Password"}
        placeholderTextColor={"#777"}
        secureTextEntry={true}
      />
      <View style={Styles.rememberBox}>
        <Checkbox
          value={isChecked}
          onValueChange={setChecked}
          color={"#227c9d"}
        />
        <Text style={Styles.rememberText}>Remember password</Text>
      </View>

      <TouchableOpacity style={Styles.sendButton}>
        <Text
          style={{ color: "#227C9D", fontWeight: "700" }}
          onPress={() => register()}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
