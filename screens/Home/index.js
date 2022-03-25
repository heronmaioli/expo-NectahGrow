import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

import { UserContext } from '../../context/userContext';
import Styles from './styles.scss';

export default function Home({ navigation }) {
  const { boards, hasConnection, setHasConnection } = useContext(UserContext);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const connected = await Network.getNetworkStateAsync();
        if (connected.isConnected) {
          setIsConnected(connected.isConnected);
          console.log(connected);
        }
      } catch (err) {
        console.log(err.response.data);
      }
    })();
  }, []);
  return (
    <View style={Styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}
          onPress={() => navigation.navigate("New Grow")}
        >
          {boards?.length === 0
            ? "No grows yet! Click here to add!"
            : `You have ${boards.length} grow in your account`}
        </Text>

        {/* <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          {isConnected ? "true" : "false"}
        </Text> */}
      </View>
    </View>
  );
}
