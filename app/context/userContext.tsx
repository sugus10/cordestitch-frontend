"use client";

import React, { createContext, useEffect, useState } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {

    const storedUser = sessionStorage.getItem('userDetails');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }}, []);

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {

    sessionStorage.removeItem('userDetails');
  }};
  
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
