import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';

import { UserContext } from '../../context/userContext';
import api from '../../services/api';
import Styles from './styles.scss';

export default function Register({ navigation }) {
  const [isChecked, setChecked] = useState(false);
  const [status, setStatus] = useState(null);

  const { setIsLoged } = useContext(UserContext);

  const sendRegister = async (data) => {
    const { confpassword, ...infos } = data;
    try {
      const response = await api.put("/registerUser", { ...infos, boards: [] });
      await AsyncStorage.setItem("@userId", response.data);
      if (isChecked) {
        await AsyncStorage.setItem("@persist", "persist");
      }
      setIsLoged(true);
      return;
    } catch (err) {
      setStatus(err.response.data);
    }
  };

  const validationSchema = yup.object().shape({
    email: yup.string().required("Required").email("It's not a valid email"),
    nickName: yup
      .string()
      .required("Required")
      .min(4, "Min 4 digits")
      .matches(
        /^[A-Za-z]+$/,
        "Nickname must to contain just letters and numbers"
      )
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
              <Text style={Styles.rememberText}>Keep conected</Text>
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
