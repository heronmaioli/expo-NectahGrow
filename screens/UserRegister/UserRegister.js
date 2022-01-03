import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import Styles from "./UserRegister.scss";

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

  const sendRegister = async (data) => {
    const { confpassword, ...infos } = data;
    const response = await api.put("/registerUser", {
      boardId: boardID,
      ...infos,
    });
    response.data ? navigation.navigate("Home") : alert("Erro no registro");
  };

  const validationSchema = yup.object().shape({
    email: yup.string().required("Required").email("It's not a valid email"),
    nickName: yup
      .string()
      .required("Required")
      .min(4, "Min 4 digits")
      .max(12, "Max 12 digits"),
    password: yup
      .string()
      .required("Required")
      .min(4, "Min 4 digits")
      .max(12, "Max 12 digits"),
    confpassword: yup
      .string()
      .required("Required")
      .min(4, "Min 4 digits")
      .max(12, "Max 12 digits"),
    // .oneOf([yup.ref("password"), null], "Passwords must match"),
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
    <ScrollView>
      <View style={Styles.background}>
        <StatusBar style="light" backgroundColor={"#2C302E"} />
        <View style={Styles.logoView}>
          <Image
            source={require("../../assets/Logo.png")}
            style={{ width: 380, height: 160 }}
          />
        </View>

        <View style={Styles.formBox}>
          <View style={{ width: "100%" }}>
            <Text style={Styles.textLabel}>Email</Text>
            <TextInput
              onChangeText={(text) => setValue("email", text)}
              placeholder={"exemple@exemple.com"}
              style={Styles.textInput}
              placeholderTextColor={"#bbb"}
            />
            {errors.email && (
              <Text style={Styles.errorMessage}>{errors.email?.message}</Text>
            )}
          </View>
          <View style={{ width: "100%" }}>
            <Text style={Styles.textLabel}>NickName</Text>
            <TextInput
              onChangeText={(text) => setValue("nickName", text)}
              placeholder={"mastergrower123"}
              style={Styles.textInput}
              placeholderTextColor={"#bbb"}
            />
            {errors.nickName && (
              <Text style={Styles.errorMessage}>
                {errors.nickName?.message}
              </Text>
            )}
          </View>
          <View style={{ width: "100%" }}>
            <Text style={Styles.textLabel}>Password</Text>
            <TextInput
              onChangeText={(text) => setValue("password", text)}
              secureTextEntry
              placeholder={"**********"}
              style={Styles.textInput}
              placeholderTextColor={"#bbb"}
            />
            {errors.password && (
              <Text style={Styles.errorMessage}>
                {errors.password?.message}
              </Text>
            )}
          </View>
          <View style={{ width: "100%" }}>
            <Text style={Styles.textLabel}>Confirm Password</Text>
            <TextInput
              onChangeText={(text) => setValue("confpassword", text)}
              secureTextEntry
              placeholder={"**********"}
              style={Styles.textInput}
              placeholderTextColor={"#bbb"}
            />
            {errors.confpassword && (
              <Text style={Styles.errorMessage}>
                {errors.confpassword?.message}
              </Text>
            )}
          </View>

          <TouchableOpacity style={Styles.sendButton}>
            <Text
              style={{ color: "#227C9D", fontWeight: "700" }}
              onPress={handleSubmit(sendRegister)}
            >
              SEND IT
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={Styles.bottomLink}>Already have an account!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserRegister;
