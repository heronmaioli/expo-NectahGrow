import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import socketClient from "socket.io-client";
import { useIsFocused } from "@react-navigation/native";

// const socket = socketClient("https://gentle-savannah-77998.herokuapp.com/");

export default function Home() {
  const isFocused = useIsFocused();
  const [rootTimeOnValue, setRootTimeOnValue] = useState("06:00:00");
  const [rootTimeOffValue, setRootTimeOffValue] = useState("21:00:00");
  const [timeOn, setTimeOn] = useState("06:00:00");
  const [timeOff, setTimeOff] = useState("21:00:00");

  const socket = isFocused ? socketClient("http://192.168.0.12:80") : undefined;

  socket.on("connect", () => {
    socket.emit("invite", "clientId");
    console.log(socket.id);
  });
  socket.on("sensorReads", (reads) => {
    console.log(reads);
  });

  socket.on("message", (message) => {
    // console.log(message);
  });
  socket.on("disconnected", (message) => {
    console.log("disconected");
  });
  return (
    <View style={styles.container}>
      <Button
        title={"new time setup"}
        onPress={() => {
          socket.emit(
            "newTimingSetup",
            { highHour: timeOn, lowHour: timeOff },
            "cc50e3beca24"
          );
        }}
      />
      <Button
        title={"show root value"}
        onPress={() => {
          console.log(rootTimeOnValue);
          console.log(typeof rootTimeOnValue);
        }}
      />
      <TextInput
        keyboardType="number-pad"
        value={timeOn}
        onEndEditing={(value) => {
          const pattern = "00:00:00";
          const valueLenght = value.nativeEvent.text.length;
          const fullString = timeOn + pattern.slice(valueLenght);
          const timeOnToNumber = parseInt(fullString.replace(/:/g, ""));
          const timeOffToNumber = parseInt(timeOff.replace(/:/g, ""));
          setTimeOn(fullString);
          if (timeOnToNumber >= 240000) {
            setTimeOn(rootTimeOnValue);
            return alert("Não pode ser maior que 23:59:59");
          }
          if (timeOnToNumber >= timeOffToNumber) {
            setTimeOn(rootTimeOnValue);
            return alert("Não pode ser maior que a hora de desligar");
          }
        }}
        onChange={(value) => {
          let temp = value.nativeEvent.text
            .replace(/(\d{2})(\d)/, "$1:$2")
            .replace(/(\d{2})(\d)/, "$1:$2")
            .replace(/(\d{2})(\d{1,2})/, "$1:$2");
          setTimeOn(temp);
        }}
        maxLength={8}
        selectTextOnFocus={true}
      />
      <TextInput
        keyboardType="number-pad"
        value={timeOff}
        onEndEditing={(value) => {
          const pattern = "00:00:00";
          const valueLenght = value.nativeEvent.text.length;
          const fullString = timeOff + pattern.slice(valueLenght);
          const timeOffToNumber = parseInt(fullString.replace(/:/g, ""));
          const timeOnToNumber = parseInt(timeOn.replace(/:/g, ""));
          setTimeOff(fullString);

          if (timeOffToNumber >= 240000) {
            setTimeOff(rootTimeOffValue);
            return alert("Não pode ser maior que 23:59:59");
          }
          if (timeOffToNumber <= timeOnToNumber) {
            setTimeOff(rootTimeOffValue);
            return alert("Não pode ser menor que a hora de desligar");
          }
        }}
        onChange={(value) => {
          let temp = value.nativeEvent.text
            .replace(/(\d{2})(\d)/, "$1:$2")
            .replace(/(\d{2})(\d)/, "$1:$2")
            .replace(/(\d{2})(\d{1,2})/, "$1:$2");
          setTimeOff(temp);
        }}
        maxLength={8}
        selectTextOnFocus={true}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
