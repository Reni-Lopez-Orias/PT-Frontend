import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  idUser: number;
  email: string;
  name: string;
  lastName: string;
}

interface DataContextType {
  Authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  userData: User | undefined;
  setUserData: (userData: User) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [Authenticated, setAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | undefined>(undefined);

  return (
    <DataContext.Provider value={{ Authenticated, setAuthenticated, userData, setUserData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('Context not exist');
  }
  return context;
};