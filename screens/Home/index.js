import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext } from 'react';
import { Button, Text, View } from 'react-native';

import { UserContext } from '../../context/userContext';
import Styles from './styles.scss';

export default function Home({ navigation }) {
  const { boards } = useContext(UserContext);

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
      </View>
    </View>
  );
}
