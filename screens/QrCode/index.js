import { useFocusEffect } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { UserContext } from '../../context/userContext';
import api from '../../services/api';
import Styles from './styles.scss';

export default function QrCode({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [status, setStatus] = useState(null);
  const { boards, setBoards, user } = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        status === "denied"
          ? navigation.navigate("AddManually")
          : setHasPermission(true);
      })();
    }, [])
  );

  const handleBarCodeScanned = (data) => {
    console.log(data);
    (async () => {
      try {
        const response = await api.put("/registerBoard", {
          boardId: data,
          userId: user,
          name: data,
        });

        const verify = boards.find((board) => {
          return board.boardId == response.data.boardId;
        });
        if (!verify) {
          setBoards([
            ...boards,
            { boardId: response.data.boardId, name: response.data.name },
          ]);
        }

        navigation.navigate(response.data.name, {
          board: response.data.boardId,
        });
      } catch (err) {
        setScanned(true);
        setStatus(err.response.data);
      }
    })();
  };

  return (
    <SafeAreaView style={Styles.container}>
      {hasPermission && (
        <View style={Styles.container}>
          <Camera
            barCodeScannerSettings={{
              barCodeTypes: ["qr"],
            }}
            onBarCodeScanned={(...args) => {
              const data = args[0].data;
              scanned ? undefined : handleBarCodeScanned(data);
            }}
            style={Styles.barcode}
          >
            <View
              style={
                !scanned ? Styles.insideSquareWhite : Styles.insideSquareRed
              }
            >
              {!scanned && <Text style={Styles.whiteText}>QR HERE</Text>}

              {scanned && (
                <TouchableOpacity
                  style={Styles.touchArea}
                  onPress={() => setScanned(false)}
                >
                  <Text style={Styles.redText}>
                    {status && status.toUpperCase()}
                  </Text>
                  <Text style={Styles.redText}>TAP TO SCAN AGAIN</Text>
                </TouchableOpacity>
              )}
            </View>
          </Camera>
          <View style={Styles.bottomTab}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddManually")}
            >
              <Text style={Styles.bottomText}>Or add manually</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
