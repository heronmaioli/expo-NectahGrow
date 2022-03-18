import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
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
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import api from "../../services/api";

import Styles from "./styles.scss";

export default function Login({ navigation, setIsLogged }) {
  const [isChecked, setChecked] = useState(false);
  const [isDenied, setIsDenied] = useState(null);

  useEffect(() => {
    register("nickName");
    register("password");
  }, [register]);

  const validationSchema = yup.object().shape({
    nickName: yup
      .string()
      .required("Required")
      .min(4, "Min 4 digits")
      .max(18, "Max 18 digits"),
    password: yup.string().required("Required"),
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const sendRegister = async (data) => {
    // const { confpassword, ...infos } = data;
    // const response = await api.put("/login", infos);
    // response.data ? navigation.navigate("Home") : alert("");
    console.log(data);
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardDismissMode="on-drag"
    >
      <SafeAreaView style={Styles.background}>
        <StatusBar style="light" backgroundColor={"#2C302E"} />

        <Image
          source={require("../../assets/Logo.png")}
          style={Styles.logoImage}
        />
        <View style={Styles.formBox}>
          <View style={Styles.formContent}>
            <Text style={Styles.textLabel}>Login</Text>
            <View style={Styles.inputBox}>
              <Text style={Styles.inputLabel}>NickName</Text>
              {isDenied && (
                <View>
                  <Text style={Styles.errorMessage}>{isDenied}</Text>
                </View>
              )}
              <TextInput
                onChangeText={(text) => setValue("nickName", text)}
                placeholder={"mastergrower123"}
                style={Styles.textInput}
                placeholderTextColor={"#777"}
              />
              {errors.nickName && (
                <Text style={Styles.errorMessage}>
                  {errors.nickName?.message}
                </Text>
              )}
            </View>
            <View style={Styles.inputBox}>
              <Text style={Styles.inputLabel}>Password</Text>
              <TextInput
                onChangeText={(text) => setValue("password", text)}
                secureTextEntry
                placeholder={"**********"}
                style={Styles.textInput}
                placeholderTextColor={"#777"}
              />
              {errors.password && (
                <Text style={Styles.errorMessage}>
                  {errors.password?.message}
                </Text>
              )}
            </View>
            <View style={Styles.rememberBox}>
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={"#227c9d"}
              />
              <Text style={Styles.rememberText}>Remember password</Text>
            </View>

            <TouchableOpacity
              style={Styles.sendButton}
              onPress={handleSubmit(sendRegister)}
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
