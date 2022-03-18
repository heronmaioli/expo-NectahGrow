import React, { useContext, useState, createContext } from "react";

export const UserContext = createContext({});

export function UserProvider({ children }) {
  const [boards, setBoards] = useState(null);
  const [isLoged, setIsLoged] = useState(false);
  const [user, setUser] = useState("");
  return (
    <UserContext.Provider
      value={{ boards, setBoards, isLoged, setIsLoged, user, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
