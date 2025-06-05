"use client";
import { store } from "@/components/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import AuthProvider from "./context/token-context";
import { UserProvider } from "./context/userContext";
import { LoginModalProvider } from "./context/login-context";
import useSessionCheck from "@/components/useSessionCheck";
import { Toaster } from "@/components/ui/sonner";


const ClientLayout = ({ children }: { children: ReactNode }) => {
  useSessionCheck();

  return (
    <Provider store={store}>
      <AuthProvider>
        <UserProvider>
          <LoginModalProvider>
          <Toaster />


            {children}
          </LoginModalProvider>
        </UserProvider>
      </AuthProvider>
    </Provider>
  );
};

export default ClientLayout;
