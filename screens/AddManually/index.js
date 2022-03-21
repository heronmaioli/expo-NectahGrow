import React, { useContext, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { UserContext } from '../../context/userContext';
import api from '../../services/api';
import Styles from './styles.scss';

const AddManually = ({ navigation, manual }) => {
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState(null);
  const { boards, setBoards, user } = useContext(UserContext);

  const sendIt = async () => {
    try {
      const response = await api.put("/registerBoard", {
        boardId: inputValue,
        userId: user,
        name: inputValue,
      });
      setBoards([
        ...boards,
        { boardId: response.data.boardId, name: response.data.name },
      ]);
      navigation.navigate(response.data.name, { board: response.data.boardId });
    } catch (err) {
      setStatus(err.response.data);
    }
  };

  return (
    <View style={Styles.background}>
      <View style={Styles.mainLayer}>
        <View style={Styles.formView}>
          <View style={Styles.formBox}>
            <Text style={Styles.textLabel}>Insert product ID</Text>
            {status && (
              <View>
                <Text style={Styles.errorMessage}>{status}</Text>
              </View>
            )}
            <TextInput
              onChangeText={setInputValue}
              value={inputValue}
              style={Styles.textInput}
              placeholder={"ex: 246f28b45774"}
              backgroundColor={"#fff"}
              placeholderTextColor={"#777"}
            />
            <TouchableOpacity
              style={Styles.sendButton}
              onPress={() => sendIt()}
            >
              <Text style={{ color: "#227C9D", fontWeight: "700" }}>
                SEND IT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={Styles.bottomTab}>
        <TouchableOpacity onPress={() => manual(false)}>
          <Text style={Styles.bottomText}>Or scan QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddManually;
