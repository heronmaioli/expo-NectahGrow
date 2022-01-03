import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import socketClient from "socket.io-client";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Styles from "./Home.scss";
import api from "../../services/api";

// const socket = socketClient("https://gentle-savannah-77998.herokuapp.com/");

export default function Home() {
  const isFocused = useIsFocused();
  const [lightState, setLightState] = useState("");
  const [inExaust, setInExaust] = useState("");
  const [outExaust, setOutExaust] = useState("");
  const [ventState, setVentState] = useState("");

  const [rootTimeOnValue, setRootTimeOnValue] = useState("");
  const [rootTimeOffValue, setRootTimeOffValue] = useState("");
  const [timeOn, setTimeOn] = useState("");
  const [timeOff, setTimeOff] = useState("");

  const [storage, setStorage] = useState(null);
  const [date, setDate] = useState(new Date(1598051730000));

  const [lightModalVisible, setLightModalVisible] = useState(false);
  const [timeOnClock, setTimeOnClock] = useState(false);
  const [timeOffClock, setTimeOffClock] = useState(false);

  const socket = isFocused ? socketClient("http://192.168.0.12:80") : undefined;

  useEffect(() => {
    (async () => {
      const storaged = await AsyncStorage.getItem("@boardID");
      setStorage(storaged);
      const response = await api.post("/getStatus", { boardId: storaged });

      setLightState(response.data.lightState);
      setInExaust(response.data.inExaust);
      setOutExaust(response.data.outExaust);
      setVentState(response.data.ventState);
      setTimeOn(response.data.highHour);
      setTimeOff(response.data.lowHour);
      console.log(response.data);
    })();
  }, []);

  const setNewTimeOn = (event, selectedDate) => {
    const currentDate = selectedDate;
    setTimeOnClock(Platform.OS === "ios");

    if (currentDate !== undefined) {
      setDate(currentDate);
      const convert = moment(currentDate).format("HH:mm:ss").toString();
      setTimeOn(convert);
      console.log(timeOn);
      socket.emit(
        "newTimingSetup",
        { highHour: timeOn, lowHour: timeOff },
        storage
      );
    }
  };

  socket.on("connect", () => {
    socket.emit("selfRegister", storage);
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
    <View style={Styles.container}>
      <StatusBar style="light" color={"#f23"} />
      <View style={Styles.header}>
        <Image source={require("../../assets/Logo.png")} />
      </View>

      <View style={Styles.gridView}>
        <View style={Styles.stGridView}>
          <View style={Styles.smallCard}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={lightModalVisible}
              onRequestClose={() => {
                setLightModalVisible(!lightModalVisible);
              }}
            >
              <View style={Styles.centeredModal}>
                <View style={Styles.modalView}>
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 20,
                    }}
                  >
                    <Button
                      onPress={() => {
                        socket.emit("lightOn", storage);
                        setLightState("ON");
                      }}
                      title="ON"
                    />
                    <Button
                      onPress={() => {
                        socket.emit("lightOff", storage);
                        setLightState("OFF");
                      }}
                      title="OFF"
                    />
                    <Button
                      onPress={() => {
                        socket.emit("lightAuto", storage);
                        setLightState("AUTO");
                      }}
                      title="AUTO"
                    />
                  </View>

                  <Pressable
                    onPress={() => setLightModalVisible(!lightModalVisible)}
                  >
                    <Text style={{ color: "#C3423F", marginTop: 25 }}>
                      Hide Modal
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (lightState === "OFF") {
                  socket.emit("lightAuto", storage);
                  setLightState("AUTO");
                } else if (lightState === "AUTO") {
                  socket.emit("lightOn", storage);
                  setLightState("ON");
                } else {
                  socket.emit("lightOff", storage);
                  setLightState("OFF");
                }
              }}
              onLongPress={() => {
                setLightModalVisible(!lightModalVisible);
              }}
              underlayColor="white"
            >
              <Image source={require("../../assets/Lamp.png")} />
              <Text style={Styles.statusTitle}>{lightState}</Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.smallCard}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                socket.emit("changeVentState", storage, !ventState);
                setVentState(!ventState);
              }}
              underlayColor="white"
            >
              <Image source={require("../../assets/Vent.png")} />
              <Text style={Styles.statusTitle}>{ventState ? "ON" : "OFF"}</Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.smallCard}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                socket.emit("changeInState", storage, !inExaust);
                setInExaust(!inExaust);
              }}
              underlayColor="white"
            >
              <Image source={require("../../assets/InExausth.png")} />
              <Text style={Styles.statusTitle}>{inExaust ? "ON" : "OFF"}</Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.smallCard}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                socket.emit("changeOutState", storage, !outExaust);
                setOutExaust(!outExaust);
              }}
              underlayColor="white"
            >
              <Image source={require("../../assets/OutExausth.png")} />
              <Text style={Styles.statusTitle}>{outExaust ? "ON" : "OFF"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={Styles.ndGridView}>
          <View style={Styles.timeItem}>
            <View>
              <Text style={Styles.timeLabel}>ON AT:</Text>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onLongPress={() => {
                  setTimeOnClock(true);
                }}
                onPress={() => setTimeOnClock(false)}
                underlayColor="white"
                onBlur={() => setTimeOnClock(false)}
              >
                <Text style={Styles.timeStyle}>{timeOn.substr(0, 5)}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={Styles.timeLabel}>OFF AT:</Text>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onLongPress={() => {}}
                underlayColor="white"
              >
                <Text style={Styles.timeStyle}>{timeOff.substr(0, 5)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {timeOnClock && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"time"}
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={setNewTimeOn}
          onBlur={() => setTimeOnClock(false)}
        />
      )}
    </View>
  );
}
