class MessageParser {
  actionProvider: any;
  state: any; 

  constructor(actionProvider: any, state: any) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message: string) {
    const lowerCaseMessage = message.toLowerCase().trim();

    // ✅ Handle Phone Number Input (10 Digits Only)
    if (/^\d{10}$/.test(message)) {
      return this.actionProvider.handlePhoneNumber(message, this.state);
    }

    // ✅ Handle OTP Input (6 Digits Only)
    if (/^\d{6}$/.test(message)) {
      return this.actionProvider.handleOtp(message, this.state);
    }

    // ✅ Handle Greeting Messages
    if (
      lowerCaseMessage.includes("hi") || 
      lowerCaseMessage.includes("hello") || 
      lowerCaseMessage.includes("hey") || 
      lowerCaseMessage.includes("good morning") || 
      lowerCaseMessage.includes("good evening")
    ) {
      return this.actionProvider.handleGreet();
    }

    // ✅ Handle "Thank You" Messages
    if (
      lowerCaseMessage.includes("thanks") || 
      lowerCaseMessage.includes("thank you") || 
      lowerCaseMessage.includes("thank you so much") ||
      lowerCaseMessage.includes("appreciate it")
    ) {
      return this.actionProvider.handleThanks();
    }

    // ✅ Handle OK/Confirmation Messages
    if (
      lowerCaseMessage.includes("ok") || 
      lowerCaseMessage.includes("okay") || 
      lowerCaseMessage.includes("sure") || 
      lowerCaseMessage.includes("done")
    ) {
      return this.actionProvider.handleOk();
    }

    // ✅ Handle Options or Help Request
    if (
      lowerCaseMessage.includes("help") ||
      lowerCaseMessage.includes("options") ||
      lowerCaseMessage.includes("can you do for me") ||
      lowerCaseMessage.includes("what can you do")
    ) {
      return this.actionProvider.handleOptions();
    }

    // ✅ Handle Bus Search
    if (
      lowerCaseMessage.includes("search bus") ||
      lowerCaseMessage.includes("find bus") ||
      lowerCaseMessage.includes("bus availability")
    ) {
      return this.actionProvider.handleBusSearch();
    }

    // ✅ Handle Booking Details
    if (
      lowerCaseMessage.includes("booking details") ||
      lowerCaseMessage.includes("my ticket") ||
      lowerCaseMessage.includes("check booking")
    ) {
      return this.actionProvider.handleBookingDetails();
    }

    // ✅ Handle Loyalty Points
    if (
      lowerCaseMessage.includes("loyalty points") ||
      lowerCaseMessage.includes("my points") ||
      lowerCaseMessage.includes("redeem points")
    ) {
      return this.actionProvider.handleLoyaltyPoints();
    }

    // ✅ Handle Customer Support
    if (
      lowerCaseMessage.includes("support") ||
      lowerCaseMessage.includes("customer care") ||
      lowerCaseMessage.includes("call support") ||
      lowerCaseMessage.includes("help me")
    ) {
      return this.actionProvider.handleCustomerSupport();
    }

    // ✅ Handle Unknown Inputs
    return this.actionProvider.handleUnknownInput();
  }
}

export default MessageParser;
