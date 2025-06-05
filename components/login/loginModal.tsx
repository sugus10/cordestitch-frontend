"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLoginModal } from "@/app/context/login-context";
import useLogin from "@/app/context/useLoginModal";

function LoginModal() {
  const Router = useRouter();
  const { open, setOpen } = useLoginModal();

  const handleNameInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  const {
    mobileErrors,
    handleMobileSubmit,
    handleOtpSubmit,
    identifierValue,
    onMobileSubmit,
    otpSubmitting,
    onOtpSubmit,
    otpErrors,
    step,
    takePhoneNumber,
    takeOtp,
    handleResendOtp,
    countdown,
    changePhoneNumber,
    AddUserDetails,
    handleUserDetails,
    mobileSubmitting,
    userDetailsError,
    userDetailsSubmitting,
    takeUserDetails,
    watch,
    setValue,
    setOtpValue
  } = useLogin();

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;

    paste.split("").forEach((digit, i) => {
      setOtpValue(`otp.${i}`, digit);  // Use dot notation and OTP form's setValue
      const input = document.getElementById(`otp-box-${i}`) as HTMLInputElement;
      if (input) input.value = digit;
    });
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, setOpen]);

  const handleClose = () => setOpen(false);

  const handleTermClick = () => {
    setOpen(false);
    Router.push("/terms&conditions");
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains("modal-overlay")) {
      handleClose();
    }
  };

  return (
  <AnimatePresence>
  {open && (
    <motion.div
      className="fixed inset-0 z-100 bg-black/80 flex items-center justify-center p-4 modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden border border-gray-200 dark:border-gray-800 mx-2"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <button
          className="absolute top-4 right-4 z-10 rounded-full p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side - Image - Hidden on small screens */}
          <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 lg:p-8  items-center justify-center">
            <div className="text-center">
              <div className="mb-4 md:mb-6">
                <img
                  src="/abcd.jpg"
                  alt="CordeStitch"
                  className="w-full h-auto max-h-48 md:max-h-56 lg:max-h-72 object-contain"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Welcome to CordeStitch</h3>
              <p className="text-gray-300 text-xs md:text-sm">Join our community of fashion enthusiasts and discover a world of personalized style.</p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full md:w-3/5 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[90vh] md:max-h-[80vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:to-gray-100">
                {step === 1 ? "Sign In" : step === 2 ? "Verify" : "Complete Profile"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                {step === 1
                  ? "Enter your phone number to continue"
                  : step === 2
                    ? "Verify your identity with OTP"
                    : "Tell us a bit more about yourself"}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="flex items-center">
                {[1, 2, 3].map((stepNumber) => (
                  <React.Fragment key={stepNumber}>
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step === stepNumber
                          ? "bg-[#3b3b3b] text-white shadow-lg"
                          : step > stepNumber
                            ? "bg-gray-700 text-white"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {step > stepNumber ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </div>
                    {stepNumber < 3 && (
                      <div
                        className={`w-12 sm:w-16 h-1 transition-all duration-300 ${
                          step > stepNumber ? "bg-gray-700" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1 - Phone Number */}
            {step === 1 && (
              <motion.form
                onSubmit={handleMobileSubmit(onMobileSubmit)}
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <Label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter your phone number"
                      {...takePhoneNumber("phoneNumber")}
                      maxLength={10}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                      }}
                      className="pl-4 w-full px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#3b3b3b] focus:border-[#3b3b3b]"
                    />
                  </div>
                  {mobileErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {mobileErrors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <Checkbox
                      id="terms"
                      checked={watch("isChecked")}
                      onCheckedChange={(checked) => {
                        setValue("isChecked", checked === true);
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="terms" className="flex flex-wrap items-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      I agree to the
                      <button
                        type="button"
                        onClick={handleTermClick}
                        className="ml-1 text-[#3b3b3b] hover:text-gray-600 dark:hover:text-gray-400 font-medium"
                      >
                        Terms and Conditions
                      </button>
                    </label>
                    {mobileErrors.isChecked && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {mobileErrors.isChecked.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-2 sm:py-3 px-4 bg-[#3b3b3b] hover:bg-gray-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  disabled={mobileSubmitting}
                >
                  {mobileSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </motion.form>
            )}

            {/* Step 2 - OTP Verification */}
            {step === 2 && (
              <motion.form
                onSubmit={handleOtpSubmit(onOtpSubmit)}
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    We've sent a 6-digit code to <span className="font-medium text-gray-800 dark:text-gray-200">{identifierValue}</span>
                  </p>
                  <button
                    type="button"
                    onClick={changePhoneNumber}
                    className="mt-1 text-xs sm:text-sm text-[#3b3b3b] hover:text-gray-600 dark:hover:text-gray-400"
                  >
                    Change number?
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {Array(6).fill("").map((_, index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="text-center h-12 w-10 sm:h-14 sm:w-12 text-lg sm:text-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#3b3b3b] focus:ring-[#3b3b3b]"
                        {...takeOtp(`otp.${index}`)}
                        id={`otp-box-${index}`}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.match(/^[0-9]$/)) {
                            const nextInput = document.getElementById(
                              `otp-box-${index + 1}`
                            ) as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          } else {
                            e.target.value = "";
                          }
                        }}
                     onKeyDown={(e) => {
  if (e.key === "Enter") {
    handleOtpSubmit(onOtpSubmit)(); // Trigger form submit
  } else if (e.key === "Backspace" && !e.currentTarget.value) {
    const previousInput = document.getElementById(
      `otp-box-${index - 1}`
    ) as HTMLInputElement;
    if (previousInput) previousInput.focus();
  }
}}

                        onPaste={(e) => handlePaste(e, index)}
                      />
                    ))}
                  </div>

                  {otpErrors.otp && (
                    <p className="text-center text-sm text-red-600 dark:text-red-400">
                      {otpErrors.otp.message}
                    </p>
                  )}
                </div>

                <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleResendOtp}
                    className={`font-medium ${
                      countdown > 0 ? 'text-gray-400 dark:text-gray-600' : 'text-[#3b3b3b] hover:text-gray-600 dark:hover:text-gray-400'
                    }`}
                  >
                    Resend OTP{countdown > 0 ? ` (${countdown}s)` : ''}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full py-2 sm:py-3 px-4 bg-[#3b3b3b] hover:bg-gray-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  disabled={otpSubmitting}
                >
                  {otpSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </motion.form>
            )}

            {/* Step 3 - User Details */}
            {step === 3 && (
              <motion.form
                onSubmit={handleUserDetails(AddUserDetails)}
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      {...takeUserDetails("firstName")}
                      onKeyPress={handleNameInput}
                      className="w-full px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#3b3b3b] focus:border-[#3b3b3b]"
                    />
                    {userDetailsError.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {userDetailsError.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      {...takeUserDetails("lastName")}
                      onKeyPress={handleNameInput}
                      className="w-full px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#3b3b3b] focus:border-[#3b3b3b]"
                    />
                    {userDetailsError.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {userDetailsError.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...takeUserDetails("emailAddress")}
                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#3b3b3b] focus:border-[#3b3b3b]"
                  />
                  {userDetailsError.emailAddress && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {userDetailsError.emailAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Gender
                  </Label>
                  <RadioGroup
                    className="grid grid-cols-3 gap-2 sm:gap-3"
                    {...takeUserDetails("gender")}
                  >
                    {[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "others", label: "Others" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="text-[#3b3b3b] focus:ring-[#3b3b3b]"
                        />
                        <Label htmlFor={option.value} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {userDetailsError.gender && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {userDetailsError.gender.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-2 sm:py-3 px-4 bg-[#3b3b3b] hover:bg-gray-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  disabled={userDetailsSubmitting}
                >
                  {userDetailsSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Completing...
                    </span>
                  ) : (
                    'Complete Registration'
                  )}
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}

export default LoginModal;