import React, { useState } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import QrCode from "../QrCode";
import AddManually from "../AddManually";

export default function AddBoard() {
  const [manual, setManual] = useState(false);
  return (
    <>
      {manual ? (
        <AddManually manual={setManual} />
      ) : (
        <QrCode manual={setManual} />
      )}
    </>
  );
}
