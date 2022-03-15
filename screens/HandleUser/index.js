import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";

import Styles from "./styles.scss";
import RegisterForm from "./Forms/registerForm";
import LoginForm from "./Forms/loginForm";

const HandleUser = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={Styles.background}>
        <StatusBar style="light" backgroundColor={"#2C302E"} />

        <Image
          source={require("../../assets/Logo.png")}
          style={Styles.logoImage}
        />
        <View style={Styles.formBox}>
          {isLogin ? (
            <>
              <LoginForm />
            </>
          ) : (
            <RegisterForm />
          )}

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={Styles.bottomLink}>
              {isLogin ? "Create new account" : " Back to Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default HandleUser;
