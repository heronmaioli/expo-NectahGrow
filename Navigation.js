import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from './context/userContext';
import LoginStackNavigator from './routes/LoginStackNavigator';
import MainDrawerNavigator from './routes/MainDrawerNavigator';
import NoNetwork from './screens/NoNetwork';

function Navigator() {
  const { isLoged, setIsLoged } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    (async () => {
      const connected = await Network.getNetworkStateAsync();
      const persist = await AsyncStorage.getItem("@persist");

      if (persist) {
        setIsLoged(true);
      }
      if (connected.isConnected) {
        setIsConnected(connected);
      }

      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      {isLoged && !isLoading && isConnected && <MainDrawerNavigator />}

      {!isLoged && !isLoading && isConnected && <LoginStackNavigator />}

      {!isConnected && (
        <Stack.Navigator>
          <Stack.Screen component={NoNetwork} name={"NoNetwork"} />
        </Stack.Navigator>
      )}
    </>
  );
}

export default Navigator;
