import React from "react";
import { View, Text } from "react-native";

export default function Header({ props }) {
  return (
    <View>
      <Text>{props.children}</Text>
    </View>
  );
}
