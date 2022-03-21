import React, { useState, useContext } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import Checkbox from "expo-checkbox";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../context/userContext";
import Styles from "./styles.scss";

export default function Login({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [status, setStatus] = useState(null);

  const { setIsLoged, setBoards } = useContext(UserContext);

  const sendRegister = async (nick, pass) => {
    const data = {
      nickName: nick,
      password: pass,
    };
    try {
      const response = await api.post("/login", data);
      await AsyncStorage.setItem("@userId", response.data._id);

      if (isChecked) {
        await AsyncStorage.setItem("@persist", "persist");
      }
      setBoards(response.data.boards);
      setIsLoged(true);
    } catch (err) {
      setStatus(err.response.data);
      setPassword("");
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardDismissMode="on-drag"
    >
      <SafeAreaView style={Styles.background}>
        <Image
          source={require("../../assets/Logo.png")}
          style={Styles.logoImage}
        />
        <View style={Styles.formBox}>
          <View style={Styles.formContent}>
            <Text style={Styles.textLabel}>Login</Text>
            {status && (
              <View>
                <Text style={Styles.errorMessage}>{status}</Text>
              </View>
            )}
            <View style={Styles.inputBox}>
              <Text style={Styles.inputLabel}>NickName</Text>

              <TextInput
                onChangeText={setNickname}
                value={nickname}
                placeholder={"mastergrower123"}
                style={Styles.textInput}
                placeholderTextColor={"#777"}
              />
            </View>
            <View style={Styles.inputBox}>
              <Text style={Styles.inputLabel}>Password</Text>
              <TextInput
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder={"**********"}
                style={Styles.textInput}
                placeholderTextColor={"#777"}
              />
            </View>
            <View style={Styles.rememberBox}>
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={"#227c9d"}
              />
              <Text style={Styles.rememberText}>Keep conected</Text>
            </View>

            <TouchableOpacity
              style={Styles.sendButton}
              onPress={() => sendRegister(nickname, password)}
            >
              <Text style={{ color: "#227C9D", fontWeight: "700" }}>Login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={Styles.bottomLink}>Create new account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
