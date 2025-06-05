import { useCallback } from "react";
import http from "../http-common";
import IRegisterResponse, { ILoginResponse, IRegisterRequest, ISendAndVerifyOtpResponse, ISendOtpLoginRequest, IVerifyOtpRequest } from "@/lib/type";

export const useAuthentication = () => {
  const sendOtpService = useCallback(
    async (data: ISendOtpLoginRequest): Promise<ISendAndVerifyOtpResponse> => {
      try {
        const res = await http.post<ISendAndVerifyOtpResponse>(
          "/api/v1/routes/auth/send-otp",
          data
        );
        return res.data;
      } catch (error) {
        console.log(error);

        throw error;
      }
    },
    []
  );

  const verifyOtpService = useCallback(
    async (data: IVerifyOtpRequest) => {
      try {
        const res = await http.post(
          "/api/v1/routes/auth/verify-otp",
          data
        );
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const loginService = useCallback(
    async (data: ISendOtpLoginRequest): Promise<ILoginResponse> => {
      try {
        const res = await http.post<ILoginResponse>("/api/user/login", data);

        return res.data;
      } catch (error) {
        throw error;
      }
    },
    []
  );
  const registerService = useCallback(
    async (data: IRegisterRequest): Promise<IRegisterResponse> => {
      const res = await http.post<IRegisterResponse>(
        "/api/user/register",
        data
      );
      return res.data;
    },
    []
  );

  return {
    sendOtpService,
    verifyOtpService,
    loginService,
    registerService,
  };
};
