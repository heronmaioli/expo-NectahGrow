import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../context/userContext";

export default function Register({ navigation }) {
  const [isChecked, setChecked] = useState(false);
  const [status, setStatus] = useState(null);

  const { setIsLoged } = useContext(UserContext);

  const sendRegister = async (data) => {
    const { confpassword, ...infos } = data;
    try {
      const response = await api.put("/registerUser", { ...infos, boards: [] });
      await AsyncStorage.setItem("@userId", response.data);
      console.log(response.data);
      if (isChecked) {
        await AsyncStorage.setItem("@persist", "persist");
      }
      setIsLoged(true);
      return;
    } catch (err) {
      setStatus(err.response.data);
      console.log(err.response.data);
    }
  };

  const validationSchema = yup.object().shape({
    email: yup.string().required("Required").email("It's not a valid email"),
    nickName: yup
      .string()
      .required("Required")
      .min(4, "Min 4 digits")
      .max(18, "Max 18 digits"),
    password: yup
      .string()
      .required("Required")
      .min(4, "Min 4 digits")
      .max(12, "Max 12 digits"),
    confpassword: yup
      .string()
      .required("Required")
      .min(4, "Min 4 digits")
      .max(12, "Max 12 digits")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    register("email");
    register("nickName");
    register("password");
    register("confpassword");
  }, [register]);

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
            <Text style={Styles.textLabel}>Create Accont</Text>
            {status && (
              <View>
                <Text style={Styles.errorMessage}>{status}</Text>
              </View>
            )}

            <View style={Styles.inputBox}>
              <Text style={Styles.inputLabel}>Email</Text>
              <TextInput
                onChangeText={(text) => setValue("email", text)}
                placeholder={"exemple@exemple.com"}
                style={Styles.textInput}
                placeholderTextColor={"#777"}
              />
              {errors.email && (
                <Text style={Styles.errorMessage}>{errors.email?.message}</Text>
              )}
            </View>

            <View style={Styles.inputBox}>
              <Text style={Styles.inputLabel}>NickName</Text>
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
                // inlineImageLeft={}
                style={Styles.textInput}
                placeholderTextColor={"#777"}
              />
              {errors.password && (
                <Text style={Styles.errorMessage}>
                  {errors.password?.message}
                </Text>
              )}
            </View>

            <View style={Styles.inputBox}>
              <Text style={Styles.inputLabel}>Confirm Password</Text>
              <TextInput
                onChangeText={(text) => setValue("confpassword", text)}
                secureTextEntry
                placeholder={"**********"}
                style={Styles.textInput}
                placeholderTextColor={"#777"}
              />
              {errors.confpassword && (
                <Text style={Styles.errorMessage}>
                  {errors.confpassword?.message}
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
              <Text style={{ color: "#227C9D", fontWeight: "700" }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}
          >
            <Text style={Styles.bottomLink}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
