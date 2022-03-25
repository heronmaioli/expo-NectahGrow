import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { Image, useWindowDimensions, View } from 'react-native';

import Styles from './styles.scss';

export default function Header({ props }) {
  return (
    <View style={Styles.header}>
      <Image source={require("../../assets/Logo.png")} />
      <Entypo
        name="menu"
        size={60}
        color="white"
        onPress={() => props.navigation.openDrawer()}
      />
    </View>
  );
}
