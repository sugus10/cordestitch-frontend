"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { addTokenToLocalStorage } from "@/app/token-manager";
import { useDispatch, useSelector } from "react-redux";

import { ILoginResponse } from "@/lib/type";
import { useLoginModal } from "./login-context";
import { selectCart } from "@/components/redux/cart/cartSlice";
import { useUserAPIService } from "../services/data.service";
import { setAuthState } from "@/components/redux/auth/authSlice";
import { useAuthentication } from "../services/auth.service";

function useLogin() {
  const cartItemData = useSelector(selectCart);
  const { setOpen, open } = useLoginModal();
  const [resendOtp, setResendOtp] = useState(false);
  const [step, setStep] = useState(1);
  const [identifierValue, setIdentifierValue] = useState("");
  const [countdown, setCountdown] = useState(60);
  const { sendOtpService, verifyOtpService, loginService } =
    useAuthentication();
  const { updateProfile, getUserDetails } = useUserAPIService();
  const dispatch = useDispatch();

  const mobileSchema = z.object({
    phoneNumber: z
      .string()
      .trim()
      .max(10)
      .regex(/^\d{10}$/, {
        message:
          "Phone number must contain only numeric characters and be exactly 10 digits",
      }),
    isChecked: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms",
    }),
  });

  const otpSchema = z.object({
    otp: z.array(z.string().length(1).regex(/^\d$/, "Each OTP digit should be a number")).length(6),
  });
  const takeNewUserDetailsSchema = z.object({
    firstName: z.string().min(1, { message: "Please enter your first name." }),
    lastName: z.string().min(1, { message: "Please enter your last name." }),
    gender: z.enum(["male", "female", "others"], {
      invalid_type_error:
        "Please select a valid gender (male, female, or others).",
    }),
    emailAddress: z
      .string()
      .email({ message: "Please enter a valid email address." }),
  });

  useEffect(() => {
    setStep(1);
  }, [open]);

  type MobileFormData = z.infer<typeof mobileSchema>;
  type OtpFormData = z.infer<typeof otpSchema>;
  type TakeNewUserDetailsData = z.infer<typeof takeNewUserDetailsSchema>;

  const {
    register: mobileRegister,
    handleSubmit: handleMobileSubmit,
    formState: { errors: mobileErrors, isSubmitting: mobileSubmitting },
    setError,
    watch,
    setValue,
    register: takePhoneNumber,
    reset: mobileFormReset,
  } = useForm<MobileFormData>({

    resolver: zodResolver(mobileSchema),
  });

  const {
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors, isSubmitting: otpSubmitting },
    setError: setOptError,
    register: takeOtp,
    reset: otpFormReset,
    setValue: setOtpValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const {
    handleSubmit: handleUserDetails,
    formState: {
      errors: userDetailsError,
      isSubmitting: userDetailsSubmitting,
    },
    register: takeUserDetails,
    reset: userDetailsFormReset,
  } = useForm<TakeNewUserDetailsData>({
    resolver: zodResolver(takeNewUserDetailsSchema),
  });

  function changePhoneNumber() {
    setIdentifierValue("");
    mobileFormReset();
    otpFormReset();
    setStep(1);
  }

  function setTimeoutForResendOtp() {
    setResendOtp(false);
    setCountdown(60);
  }

  useEffect(() => {
    if (countdown > 0 && !resendOtp) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (countdown === 0) {
      setResendOtp(true);
    }
  }, [countdown, resendOtp]);

  const onMobileSubmit = async (data: MobileFormData) => {
    console.log('Form submitted with data:', data);
    try {
      console.log('Attempting to send OTP...');
      const payload = {
        phoneNumber: data.phoneNumber,
      };
      const res = await sendOtpService(payload);
      console.log('OTP API response:', res);
      if (res) {
        setIdentifierValue(data.phoneNumber);
        setStep(2);
        setTimeoutForResendOtp();
      }
    } catch (error: any) {
      console.error('OTP send error:', error);
      if (error.response?.data?.message) {
        setError("phoneNumber", { message: error.response.data.message });
      } else {
        setError("phoneNumber", { message: "an unknown error occurred" });
      }
    }
  };



  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      const payload = {
        phoneNumber: identifierValue,
        otp: data.otp.join(""),

      };
      const res = await verifyOtpService(payload);
      console.log("res" + res?.status);

      if (res?.status === "200") {
        console.log("comming");

        addTokenToLocalStorage(res?.data?.accessToken)
        if (res?.data?.firstName === null || res?.user?.lastName === null) {

          setStep(3)
          return
        }
        const user = {
          firstName: res?.data?.firstName,
          lastName: res?.data?.lastName,
          email: res?.data?.email,
          phoneNumber: res?.data?.phoneNumber,
          gender: res?.data?.gender,
          isVerified: res?.data?.isVerified,
        }
        const authState = {
          user: user,
          isAuthenticated: true,
        };
        dispatch(setAuthState(authState));
        setStep(1);
        otpFormReset();
        mobileFormReset();
        setIdentifierValue("");
        setOpen(false);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setOptError("otp", { message: error.response.data.message });
      } else {
        setOptError("otp", { message: "An unknown error occurred" });
      }
    }
  };


  const AddUserDetails = async (data: TakeNewUserDetailsData) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.emailAddress,
    };
  
    try {
      const res = await updateProfile(payload);
  
      if (res) {
        const user = {
          firstName: res?.data?.firstName,
          lastName: res?.data?.lastName,
          email: res?.data?.email,
          phoneNumber: res?.data?.phoneNumber,
          gender: res?.data?.gender,
          isVerified: res?.data?.isVerified,
        };
  
        const authState = {
          user: user,
          isAuthenticated: true,
        };
  
        dispatch(setAuthState(authState));
        setStep(1);
        otpFormReset();
        mobileFormReset();
        setIdentifierValue("");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  async function handleResendOtp() {
    for (let i = 0; i < 6; i++) {
      const otpInput = document.getElementById(`otp-box-${i}`) as HTMLInputElement;
      if (otpInput) otpInput.value = "";
    }
    setResendOtp(false);

    setTimeoutForResendOtp();
    try {
      const payload = {
        phoneNumber: identifierValue,

      };
      const res = await sendOtpService(payload);
      if (res.statusCode === 500) {
        setOptError("otp", { message: "somthing went wrong" });
        return;
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
    }
  }

  useEffect(() => {
    if (!open) {
      mobileFormReset();
      otpFormReset();
      setIdentifierValue("");
      setCountdown(60);
      setResendOtp(false);
    }
  }, [open, mobileFormReset, otpFormReset]);


  return {
    step,
    resendOtp,
    setValue,
    watch,
    otpSubmitting,
    userDetailsError,
    AddUserDetails,
    handleUserDetails,
    identifierValue,
    takeUserDetails,
    countdown,
    mobileSubmitting,
    mobileErrors,
    otpErrors,
    userDetailsSubmitting,
    handleMobileSubmit,
    handleOtpSubmit,
    onMobileSubmit,
    onOtpSubmit,
    takePhoneNumber,
    takeOtp,
    handleResendOtp,
    changePhoneNumber,
    setOtpValue
  };
}

export default useLogin;
