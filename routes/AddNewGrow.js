import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';

import AddManually from '../screens/AddManually';
import QrCode from '../screens/QrCode';

export default function AddNewGrow({ navigation }) {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={"QrCode"} component={QrCode} />
        <Stack.Screen name={"AddManually"} component={AddManually} />
      </Stack.Navigator>
    </>
  );
}
