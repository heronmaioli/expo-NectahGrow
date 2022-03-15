import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import Styles from "../styles.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../../services/api";

export default function RegisterForm() {
  const sendRegister = (data) => {
    // const { confpassword, ...infos } = data;
    // const response = await api.put("/registerUser", infos);
    // response.data ? navigation.navigate("Home") : alert("Erro no registro");
    console.log(data);
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
    <View style={Styles.formContent}>
      <Text style={Styles.textLabel}>Create Accont</Text>

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
          <Text style={Styles.errorMessage}>{errors.nickName?.message}</Text>
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
          <Text style={Styles.errorMessage}>{errors.password?.message}</Text>
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

      <TouchableOpacity style={Styles.sendButton}>
        <Text
          style={{ color: "#227C9D", fontWeight: "700" }}
          onPress={handleSubmit(sendRegister)}
        >
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
