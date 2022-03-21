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

const defaultValues = {
  boards: null,
  setBoards: () => {},
  isLoged: false,
  setIsLoged: () => {},
  user: null,
  setUser: () => {},
  hasConnection: true,
  setHasConnection: () => {},
};

export const UserContext = createContext(defaultValues);

export const UserProvider = ({ children }) => {
  const [boards, setBoards] = useState(null);
  const [isLoged, setIsLoged] = useState(false);
  const [user, setUser] = useState(null);
  const [hasConnection, setHasConnection] = useState(true);

  return (
    <UserContext.Provider
      value={{
        boards,
        setBoards,
        isLoged,
        setIsLoged,
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
