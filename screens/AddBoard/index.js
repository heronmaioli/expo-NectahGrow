import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';

import AddManually from '../AddManually';
import QrCode from '../QrCode';

const Stack = createNativeStackNavigator();

export default function AddBoard({ navigation }) {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={"QrCode"} component={QrCode} />
        <Stack.Screen name={"AddManually"} component={AddManually} />
      </Stack.Navigator>
    </>
  );
}
