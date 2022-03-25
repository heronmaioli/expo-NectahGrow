import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import io from 'socket.io-client';

import api from '../../services/api';
import Styles from './styles.scss';

// const socket = io("https://gentle-savannah-77998.herokuapp.com/");
const socket = io("http://192.168.0.12:80");

export default function BoardScreen({ route }) {
  const [boardId, setBoardsId] = useState(route?.params?.board);
  const [lightState, setLightState] = useState("");
  const [inExaust, setInExaust] = useState(false);
  const [outExaust, setOutExaust] = useState(false);
  const [ventState, setVentState] = useState(false);
  const [temperature, setTemperature] = useState(Number);
  const [maxTemperature, setMaxTemperature] = useState(Number);
  const [humidity, setHumidity] = useState(Number);
  const [maxHumidity, setMaxHumidity] = useState(Number);
  const [timeOn, setTimeOn] = useState("");
  const [timeOff, setTimeOff] = useState("");
  const [lightModalVisible, setLightModalVisible] = useState(false);
  const [timeOnClock, setTimeOnClock] = useState(false);
  const [timeOffClock, setTimeOffClock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("connected");
    }
    (async () => {
      try {
        const response = await api.get("/getStatus?boardId=" + boardId);
        setLightState(response.data.lightState);
        setInExaust(response.data.inExaust);
        setOutExaust(response.data.outExaust);
        setVentState(response.data.ventState);
        setTemperature(response.data.temperature);
        setHumidity(response.data.humidity);
        setTimeOn(new Date(`Thu, 01 Jan 1970 ${response.data.highHour}`));
        setTimeOff(new Date(`Thu, 01 Jan 1970 ${response.data.lowHour}`));
        setIsLoading(false);
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

      socket.emit(
        "newTimingSetup",
        { highHour: formatedTimeOn, lowHour: formatedTimeOff },
        boardId
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

      socket.emit(
        "newTimingSetup",
        { highHour: formatedTimeOn, lowHour: formatedTimeOff },
        boardId
      );
    }
  };

  socket.on("connect", () => {
    console.log("conected");
  });
  socket.emit("joinRoom", boardId);

  socket.on("sensorReads", (reads) => {
    setTemperature(reads.temperature);
    setHumidity(reads.humidity);
    console.log(reads);
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
  socket.on("changeVentState", (status) => {
    setVentState(status);
  });
  socket.on("changeInState", (status) => {
    setInExaust(status);
  });
  socket.on("changeOutState", (status) => {
    setOutExaust(status);
  });

  socket.on("newTimingSetup", (status) => {
    setTimeOn(new Date(`Thu, 01 Jan 1970 ${status.highHour}`));
    setTimeOff(new Date(`Thu, 01 Jan 1970 ${status.lowHour}`));
  });

  socket.on("disconnected", (message) => {
    console.log(message);
    console.log("disconected");
  });

  console.log(route);
  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>{route.name}</Text>
      <View style={Styles.gridView}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#52aa5e" />
          </View>
        ) : (
          <>
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
                            socket.emit("lightOn", boardId);
                            setLightState("ON");
                          }}
                          title="ON"
                        />
                        <Button
                          onPress={() => {
                            socket.emit("lightOff", boardId);
                            setLightState("OFF");
                          }}
                          title="OFF"
                        />
                        <Button
                          onPress={() => {
                            socket.emit("lightAuto", boardId);
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
                      socket.emit("lightAuto", boardId);
                      setLightState("AUTO");
                    } else if (lightState === "AUTO") {
                      socket.emit("lightOn", boardId);
                      setLightState("ON");
                    } else {
                      socket.emit("lightOff", boardId);
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
                    socket.emit("changeVentState", boardId, !ventState);
                    setVentState(!ventState);
                  }}
                  underlayColor="white"
                >
                  <Image source={require("../../assets/Vent.png")} />
                  <Text style={Styles.statusTitle}>
                    {ventState ? "ON" : "OFF"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={Styles.smallCard}>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    socket.emit("changeInState", boardId, !inExaust);
                    setInExaust(!inExaust);
                  }}
                  underlayColor="white"
                >
                  <Image source={require("../../assets/InExausth.png")} />
                  <Text style={Styles.statusTitle}>
                    {inExaust ? "ON" : "OFF"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={Styles.smallCard}>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    socket.emit("changeOutState", boardId, !outExaust);
                    setOutExaust(!outExaust);
                  }}
                  underlayColor="white"
                >
                  <Image source={require("../../assets/OutExausth.png")} />
                  <Text style={Styles.statusTitle}>
                    {outExaust ? "ON" : "OFF"}
                  </Text>
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
            {/* <Button
              title={"teste"}
              onPress={() => {
                socket.emit("teste");
              }}
            /> */}
          </>
        )}
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
