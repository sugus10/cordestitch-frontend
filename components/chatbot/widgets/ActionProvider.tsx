import { connect, useDispatch } from "react-redux";


import axios from "axios";
import { useSelector } from "react-redux";

import { addTokenToLocalStorage } from "@/app/token-manager";
import { logout, selectAuth, setAuthState } from "@/components/redux/auth/authSlice";
import { loginService, sendOtpService, useUserAPIService, verifyOtpService } from "@/app/services/data.service";
import { clearCart, selectCart } from "@/components/redux/cart/cartSlice";
import { useLoginModal } from "@/app/context/login-context";
import { ISendOtpLoginRequest } from "@/lib/type";

export interface ChatBotMessage {
  id: string;
  message: string;
  type: string;
  widget: string;
  loading: boolean;
  terminateLoading?: boolean;
  status?: string;
}

interface Options {
  widget?: string;
  loading?: boolean;
  terminateLoading?: boolean;
  [key: string]: any;
}
interface TakeNewUserDetailsData {
  firstName: string;
  lastName: string;
}
interface AuthTokenResponse {
  accessToken: string;
  tokenExpiryTime: string;
  refreshTokenExpiryTime: string;
  statusCode: number;
}
interface ILoginResponse {
  firstName: string;
  lastName: string;
  emailAddress: string;
  emailAddressVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  referralCode: string;
  userType: string;
  authTokenResponse: AuthTokenResponse;
  gender: string;
}

type SetStateFunc = (state: (prevState: any) => any) => void;

class ActionProvider {
  auth = useSelector(selectAuth);
  dispatch = useDispatch();
  cartItemData = useSelector(selectCart);
  logoutService=useUserAPIService().logoutService;
 
  updateProfile = useUserAPIService().updateProfile;
  getUserDetails = useUserAPIService().getUserDetails;

  createChatBotMessage: (message: string, options?: Options) => ChatBotMessage;
  setState: SetStateFunc;

  identifierValue: string | null = null;
  isPhoneNumberSubmitted: boolean = false;

  constructor(
    createChatBotMessage: (
      message: string,
      options?: Options
    ) => ChatBotMessage,

    setStateFunc: SetStateFunc,
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;

    const storedIdentifierValue = localStorage.getItem("identifierValue");
    if (storedIdentifierValue) {
      this.identifierValue = storedIdentifierValue;
    }

    this.setIdentifierValue = this.setIdentifierValue.bind(this);
    this.setIsPhoneNumberSubmitted = this.setIsPhoneNumberSubmitted.bind(this);
    this.setTimeoutForResendOtp = this.setTimeoutForResendOtp.bind(this);
    this.handlePhoneNumber = this.handlePhoneNumber.bind(this);
    this.handleOtp = this.handleOtp.bind(this);
  }
  setIdentifierValue = (phoneNumber: string): void => {
    this.identifierValue = phoneNumber;

    localStorage.setItem("identifierValue", phoneNumber);

    this.setState((prevState) => ({
      ...prevState,
      identifierValue: phoneNumber,
    }));
  };

  setIsPhoneNumberSubmitted = (status: boolean): void => {
    this.setState((prevState) => ({
      ...prevState,
      isPhoneNumberSubmitted: status,
    }));
  };

  setTimeoutForResendOtp = (): void => {
    this.setState((prevState) => ({
      ...prevState,
      otpResendTimeout: true,
    }));

    setTimeout(() => {
      this.setState((prevState) => ({
        ...prevState,
        otpResendTimeout: false,
      }));
    }, 30000);
  };

  handleOrderDetails = async (state: any): Promise<void> => {
    if (this.auth.isAuthenticated) {
      const message = this.createChatBotMessage("Your Order Details", {
        widget: "orderDetailsButton",
      });
      this.addMessageToState(message);
      return;
    }

    if (!state.phoneNumber) {
      const message = this.createChatBotMessage(
        "Please enter your phone number to continue."
      );
      this.addMessageToState(message);
      state.awaitingPhoneNumber = true;
      return;
    }

    await this.handlePhoneNumber(state.phoneNumber);

    if (!state.otp) {
      const message = this.createChatBotMessage(
        "Please enter the OTP sent to your phone."
      );
      this.addMessageToState(message);
      state.awaitingOtp = true;
      return;
    }

    await this.handleOtp(state.otp);
    const message = this.createChatBotMessage("Your Order Details", {
      widget: "orderDetailsButton",
    });
    this.addMessageToState(message);

    if (!this.auth.user?.firstName || !this.auth.user?.lastName) {
      const message = this.createChatBotMessage(
        "Please provide your first and last name to continue."
      );
      this.addMessageToState(message);
      state.awaitingName = true;
      return;
    }
  };


  handleLogout = async (): Promise<void> => {
    try {
      const response = await this.logoutService();
      if (response) {
        this.dispatch(logout()); 
        this.dispatch(clearCart()); 

        // Remove session storage data
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
        }

        // Show logout confirmation message
        const logoutMessage = this.createChatBotMessage("You have been logged out.");
        this.addMessageToState(logoutMessage);
        const optionsMessage = this.createChatBotMessage(
          "How can I help further? Below are some possible options.",
          {
            widget: "options",
            loading: true,
            terminateLoading: true,
          }
        );
    
        setTimeout(() => {
          this.addMessageToState(optionsMessage);
        }, 500);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      const errorMessage = this.createChatBotMessage("Something went wrong while logging out.");
      this.addMessageToState(errorMessage);
    }
  };
  handleLogin = () => {
    const { setOpen } = useLoginModal();

    if (this.auth.isAuthenticated) {
      this.handleOptions({
        widget: "options",
        loading: true,
        terminateLoading: true,
      });
    } else {
      setOpen(true);
    }
  };

  handleShow=() => {
    const optionsMessage = this.createChatBotMessage(
          "How can I help you? Below are some possible options.",
          {
            widget: "options",
            loading: true,
            terminateLoading: true,
          }
        );
        this.addMessageToState(optionsMessage);
  }


  handleOptions = (options?: Options): void => {
    const message = this.createChatBotMessage(
      "How can I help you? Below are some possible options.",
      {
        widget: "options",
        loading: true,
        terminateLoading: true,
        ...options,
      }
    );
    this.addMessageToState(message);
  };

  handleOk = (options?: Options): void => {
    const message = this.createChatBotMessage(
      "Okay , you can proceed with this",
      {
        widget: "options",
        loading: true,
        terminateLoading: true,
        ...options,
      }
    );
    this.addMessageToState(message);
  };

  handleAfterSuccess = (message: string): void => {
    const successMessage = this.createChatBotMessage(message, {
      widget: "options",
    });
    this.addMessageToState(successMessage);
  };

  handleThanks = (): void => {
    const message = this.createChatBotMessage("You're welcome, and stay safe!");
    this.addMessageToState(message);
  };

  handleGreet = (): void => {
    const message = this.createChatBotMessage("Hello, how's it going?");
    this.addMessageToState(message);
  };

  handleLoyaltyPoints = (): void => {
    const message = this.createChatBotMessage("How can I help you", {
      widget: "loyaltyPointsButton",
    });
    this.addMessageToState(message);
  };


  
  


  handleDeliveryAtDoorstep = async (state: any): Promise<void> => {
    if (this.auth.isAuthenticated) {
      const message = this.createChatBotMessage("Please choose an option:", {
        widget: "deliveryOptions",
      });
      this.addMessageToState(message);
      return;
    }

    if (!state.phoneNumber) {
      const message = this.createChatBotMessage(
        "Please enter your phone number to continue."
      );
      this.addMessageToState(message);
      state.awaitingPhoneNumber = true;
      return;
    }

    await this.handlePhoneNumber(state.phoneNumber);

    if (!state.otp) {
      const message = this.createChatBotMessage(
        "Please enter the OTP sent to your phone."
      );
      this.addMessageToState(message);
      state.awaitingOtp = true;
      return;
    }

    await this.handleOtp(state.otp);


    if (!this.auth.user?.firstName || !this.auth.user?.lastName) {
      const message = this.createChatBotMessage(
        "Please provide your first and last name to continue."
      );
      this.addMessageToState(message);
      state.awaitingName = true;
      return;
    }
  };

  handlePhoneNumber = async (phoneNumber: string): Promise<void> => {
    if (/^\d{10}$/.test(phoneNumber)) {
      try {
        const payload: ISendOtpLoginRequest = {
          phoneNumber: phoneNumber,
        };
        const res = await sendOtpService(payload);
        if (res) {
          this.setIdentifierValue(phoneNumber);
          this.setIsPhoneNumberSubmitted(true);
          this.setTimeoutForResendOtp();
          const otpMessage = this.createChatBotMessage(
            "OTP sent successfully, please enter."
          );
          this.addMessageToState(otpMessage);
        } else {
          const errorMessage = this.createChatBotMessage(
            "Failed to send OTP. Please try again."
          );
          this.addMessageToState(errorMessage);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        const errorMessage = this.createChatBotMessage(
          "An error occurred while sending the OTP. Please try again."
        );
        this.addMessageToState(errorMessage);
      }
    } else {
      const message = this.createChatBotMessage(
        "Please enter a valid 10-digit phone number."
      );
      this.addMessageToState(message);
    }
  };

  handleOtp = async (otp: string): Promise<void> => {
    const otpCode = otp.toString();
    if (/^\d{6}$/.test(otpCode)) {
      try {
      } catch (error) {
        console.error("Error verifying OTP:", error);
        const errorMessage = this.createChatBotMessage(
          "An error occurred while verifying the OTP. Please try again."
        );
        this.addMessageToState(errorMessage);
      }
    } else {
      const errorMessage = this.createChatBotMessage(
        "Please enter a valid 6-digit OTP."
      );
      this.addMessageToState(errorMessage);
    }
  };




  handleCheckIn = (): void => {
    const message = this.createChatBotMessage("You Can Check-In Below", {
      widget: "getEmployeeCheckIn",
    });
    this.addMessageToState(message);
  };
  handleUnknownInput = (): void => {
    const unknownMessage = this.createChatBotMessage(
      "I didn't understand what you are saying."
    );
    this.addMessageToState(unknownMessage);

    const optionsMessage = this.createChatBotMessage(
      "How can I help you? Below are some possible options.",
      {
        widget: "options",
        loading: true,
        terminateLoading: true,
      }
    );

    setTimeout(() => {
      this.addMessageToState(optionsMessage);
    }, 500);
  };

  // handleBookSlot = async (): Promise<void> => {
  //   try {
  //     const userPhone = this.auth.user?.phoneNumber;

  //     if (!userPhone) {
  //       const errorMessage = this.createChatBotMessage(
  //         "Phone number is missing. Please update your details and try again."
  //       );
  //       this.addMessageToState(errorMessage);
  //       return;
  //     }

  //     console.log("userPhone: " + userPhone);
  //     // const response = await fetchOrderItems(userPhone);

  //     if (response) {
  //       const data = await response;
  //       this.setUserDetails(data);

  //       const message = this.createChatBotMessage(
  //         "Here are your order details:",
  //         {
  //           widget: "orderDetailsDisplay",
  //         }
  //       );
  //       this.addMessageToState(message);
  //     } else {
  //       const errorMessage = this.createChatBotMessage(
  //         "No order details found. Please check your details and try again."
  //       );
  //       this.addMessageToState(errorMessage);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching order details:", error);

  //     const errorMessage = this.createChatBotMessage(
  //       "An unexpected error occurred while fetching order details. Please try again later."
  //     );
  //     this.addMessageToState(errorMessage);
  //   }
  // };

  // handleViewBookedSlot = async () => {
  //   try {
  //     const response = await viewBookedSlots();
  //     if (response) {
  //       const slotTimes = response as BookedSlotTimes;
  //       this.setSlotTimes(slotTimes);
  //       console.log("Fetched Slot Times:", slotTimes);
  //       const message = this.createChatBotMessage("Your booked slots:", {
  //         widget: "BookedSlots",
  //       });
  //       this.addMessageToState(message);
  //     } else {
  //       const errorMessage = this.createChatBotMessage(
  //         "Error fetching booked slots."
  //       );
  //       this.addMessageToState(errorMessage);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching booked slots:", error);
  //     const errorMessage = this.createChatBotMessage(
  //       "Failed to fetch booked slots. Please check your connection and try again later."
  //     );
  //     this.addMessageToState(errorMessage);
  //   }
  // };

  setSlotTimes = (data: any): void => {
    this.setState((prevState) => ({
      ...prevState,
      slotTimes: data,
    }));
  };

  setUserDetails = (data: any): void => {
    this.setState((prevState) => ({
      ...prevState,
      userDetails: data,
    }));
  };

  validatePhoneNumberOrEmail = (input: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneRegex.test(input) || emailRegex.test(input);
  };

  handleCloseWidget = (): void => {
    this.setState((prevState) => ({
      ...prevState,
      widget: null,
    }));
  };

  addMessageToState = (message: ChatBotMessage): void => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };

  sendMessageWithStatus = async (messageContent: string): Promise<void> => {
    const sentMessage = this.createChatBotMessage(messageContent, {
      status: "sent",
    });
    this.addMessageToState(sentMessage);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const deliveredMessage = { ...sentMessage, status: "delivered" };
    this.updateMessageStatus(deliveredMessage);

    this.simulateTyping();
  };

  simulateTyping = async (): Promise<void> => {
    const typingMessage = this.createChatBotMessage("...typing", {
      status: "typing",
    });
    this.addMessageToState(typingMessage);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const seenMessage = { ...typingMessage, status: "seen" };
    this.updateMessageStatus(seenMessage);
  };

  updateMessageStatus = (updatedMessage: ChatBotMessage): void => {
    this.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.map((msg: ChatBotMessage) => {
        if (msg.id === updatedMessage.id) {
          return updatedMessage;
        }
        return msg;
      }),
    }));
  };
}

export default ActionProvider;
