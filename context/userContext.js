import React, { createContext, useState } from 'react';

// type BoardsType = {
//   name: string;
//   boardId: string;
// };

// type PropsUserContextType = {
//   boards: BoardsType[] | null;
//   setBoards: React.Dispatch<React.SetStateAction<BoardsType | null>>;
//   isLoged: boolean;
//   setIsLoged: React.Dispatch<React.SetStateAction<boolean>>;
//   user: string | null;
//   setUser: React.Dispatch<React.SetStateAction<string | null>>;
//   hasConnection: boolean;
//   setHasConnection: React.Dispatch<React.SetStateAction<boolean>>;
// };

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [isLoged, setIsLoged] = useState(false);
  const [user, setUser] = useState(null);
  const [hasConnection, setHasConnection] = useState(true);
  const [prevRoom, setPrevRoom] = useState("");

  return (
    <UserContext.Provider
      value={{
        boards,
        setBoards,
        isLoged,
        setIsLoged,
        user,
        setUser,
        prevRoom,
        setPrevRoom,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
