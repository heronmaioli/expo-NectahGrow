import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  Text,
  Pressable,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import io from "socket.io-client";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Styles from "./styles.scss";
import api from "../../services/api";

// const socket = io("https://gentle-savannah-77998.herokuapp.com/");

const socket = io("http://192.168.0.12:80");

export default function Home() {
  const [lightState, setLightState] = useState("");
  const [inExaust, setInExaust] = useState("");
  const [outExaust, setOutExaust] = useState("");
  const [ventState, setVentState] = useState("");
  const [temperature, setTemperature] = useState(Number);
  const [maxTemperature, setMaxTemperature] = useState(Number);
  const [humidity, setHumidity] = useState(Number);
  const [maxHumidity, setMaxHumidity] = useState(Number);
  const [timeOn, setTimeOn] = useState("");
  const [timeOff, setTimeOff] = useState("");
  const [storage, setStorage] = useState("cc50e3beca24");
  const [lightModalVisible, setLightModalVisible] = useState(false);
  const [timeOnClock, setTimeOnClock] = useState(false);
  const [timeOffClock, setTimeOffClock] = useState(false);

  socket.open();
  useEffect(() => {
    (async () => {
      // const storaged = await AsyncStorage.getItem("@boardID");
      const storaged = storage;
      // setStorage(storaged);
      try {
        const response = await api.post("/getStatus", { boardId: storaged });
        setLightState(response.data.lightState);
        setInExaust(response.data.inExaust);
        setOutExaust(response.data.outExaust);
        setVentState(response.data.ventState);
        setTemperature(response.data.temperature);
        setHumidity(response.data.humidity);
        setTimeOn(new Date(`Thu, 01 Jan 1970 ${response.data.highHour}`));
        setTimeOff(new Date(`Thu, 01 Jan 1970 ${response.data.lowHour}`));
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const setNewTimeOn = (event, selectedDate) => {
    const currentDate = selectedDate;
    setTimeOnClock(Platform.OS === "ios");

    if (currentDate !== undefined) {
      setTimeOn(currentDate);

      const formatedTimeOn = moment(currentDate).format("HH:mm:ss").toString();
      const formatedTimeOff = moment(timeOff).format("HH:mm:ss").toString();
      console.log(formatedTimeOn);
      console.log(formatedTimeOff);

      socket.emit(
        "newTimingSetup",
        { highHour: formatedTimeOn, lowHour: formatedTimeOff },
        storage
      );
    }
  };
  const setNewTimeOff = (event, selectedDate) => {
    const currentDate = selectedDate;
    setTimeOffClock(Platform.OS === "ios");

    if (currentDate !== undefined) {
      setTimeOff(currentDate);
      const formatedTimeOn = moment(timeOn).format("HH:mm:ss").toString();
      const formatedTimeOff = moment(currentDate).format("HH:mm:ss").toString();

      console.log(formatedTimeOn);
      console.log(formatedTimeOff);

      socket.emit(
        "newTimingSetup",
        { highHour: formatedTimeOn, lowHour: formatedTimeOff },
        storage
      );
    }
  };

  socket.on("connect", () => {
    socket.emit("joinRoom", storage);
  });

  socket.on("sensorReads", (reads) => {
    setTemperature(reads.temperature);
    setHumidity(reads.humidity);
    console.log(reads);
    setCount(count + 1);
  });

  socket.on("setLightOn", () => {
    setLightState("ON");
  });
  socket.on("setLightOff", () => {
    setLightState("OFF");
  });
  socket.on("setLightAuto", () => {
    setLightState("AUTO");
  });
  socket.on("changeVentState", () => {
    setLightState("AUTO");
  });
  socket.on("changeInState", () => {
    setLightState("AUTO");
  });
  socket.on("changeInState", () => {
    setLightState("AUTO");
  });

  socket.on("newTimingSetup", (status) => {
    setTimeOn(new Date(`Thu, 01 Jan 1970 ${status.highHour}`));
    setTimeOff(new Date(`Thu, 01 Jan 1970 ${status.lowHour}`));
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
                <Text style={Styles.timeStyle}>
                  {moment(timeOn).format("HH:mm")}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={Styles.timeLabel}>OFF AT:</Text>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onLongPress={() => {
                  setTimeOffClock(true);
                }}
                onPress={() => setTimeOffClock(false)}
                underlayColor="white"
                onBlur={() => setTimeOffClock(false)}
              >
                <Text style={Styles.timeStyle}>
                  {moment(timeOff).format("HH:mm")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={Styles.sensorDataView}>
              <Image
                source={require("../../assets/Temperature.png")}
                style={{ width: 40, height: 90 }}
              />
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {temperature + "°C"}
              </Text>
            </View>
            <View style={Styles.sensorDataView}>
              <Image
                source={require("../../assets/Humidity.png")}
                style={{ width: 40, height: 90 }}
              />
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {humidity + "%"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {timeOnClock && (
        <DateTimePicker
          testID="dateTimePicker"
          value={timeOn}
          mode={"time"}
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={setNewTimeOn}
          onBlur={() => setTimeOnClock(false)}
        />
      )}
      {timeOffClock && (
        <DateTimePicker
          testID="dateTimePicker"
          value={timeOff}
          mode={"time"}
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={setNewTimeOff}
          onBlur={() => setTimeOffClock(false)}
        />
      )}
    </View>
  );
}
