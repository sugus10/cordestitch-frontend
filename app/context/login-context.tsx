"use client";

import React, { createContext, useContext, useState } from "react";

interface LoginModalContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModalContext = createContext<LoginModalContextProps | undefined>(
  undefined
);

export const LoginModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <LoginModalContext.Provider value={{ open, setOpen }}>
      {children}
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within a LoginModalProvider");
  }
  return context;
};
